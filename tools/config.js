/* GLOBAL CONFIGURATION FILE
   Lawyer Bot 2026
*/

const APP_DATA = {
    year: 2026,
    currency: "₴",
    
    // БАЗОВІ СТАНДАРТИ (Змінювати тільки тут!)
    base: {
        minWage: 8647,          // Мінімальна зарплата (МЗП)
        livingWage: {
            able: 3328,         // Працездатні
            child6: 2817,       // Діти до 6
            child18: 3512,      // Діти 6-18
            lost: 2595          // Непрацездатні (Пенсія)
        },
        nmdg: 17                // Неоподатковуваний мінімум
    },

    // СТАВКИ (У відсотках: 0.22 = 22%)
    rates: {
        esv: 0.22,              // ЄСВ
        warTaxFixed: 0.10,      // ВЗ для ФОП 1-2 груп (від МЗП)
        psp: 0.50,              // ПСП (від ПМ працездатних)
        crime: 0.20             // Поріг криміналу (від ПСП)
    }
};

// АВТОМАТИЧНІ РОЗРАХУНКИ (Не чіпати, рахує само)
const FIN = {
    ...APP_DATA.base,
    
    // Податки
    esv: APP_DATA.base.minWage * APP_DATA.rates.esv,                    // 1760
    warTax: APP_DATA.base.minWage * APP_DATA.rates.warTaxFixed,         // 800
    
    // Соціальні / Кримінал
    psp: APP_DATA.base.livingWage.able * APP_DATA.rates.psp,            // 1664
    crimeThreshold: (APP_DATA.base.livingWage.able * APP_DATA.rates.psp) * APP_DATA.rates.crime, // 332.80
    
    // Судовий збір (Фізособи)
    courtFee: {
        min: APP_DATA.base.livingWage.able * 0.4,
        max: APP_DATA.base.livingWage.able * 5
    },

    // Аліменти (50% від ПМ)
    alimony: {
        min6: APP_DATA.base.livingWage.child6 * 0.5,
        min18: APP_DATA.base.livingWage.child18 * 0.5
    },

    // Штрафи Держпраці
    fines: {
        noJob: APP_DATA.base.minWage * 10,  // 10 МЗП (неоформлення)
        ignore: APP_DATA.base.minWage * 3   // 3 МЗП (інші порушення)
    }
};

// УТИЛІТИ (Доступні у всіх модулях)
const Utils = {
    // Форматування: 8000 -> "8 000 ₴"
    fmt: (num) => {
        if (!num && num !== 0) return "-";
        return num.toLocaleString('uk-UA') + " " + APP_DATA.currency;
    },
    
    // Оновлення елемента по ID
    setVal: (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = Utils.fmt(val);
    },

    // Копіювання тексту
    copy: (val, label = "") => {
        let text = val.toString().replace(/\s/g, '').replace('₴', '');
        navigator.clipboard.writeText(text);
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        // Можна додати виклик тоста, якщо він є на сторінці
        if (typeof showToast === 'function') showToast(label, text);
        else alert(`Скопійовано: ${text}`);
    }
};

// Робимо доступним глобально
window.Config = {
    Data: APP_DATA,
    Fin: FIN,
    Utils: Utils
};