export const formatNumberWithCommas = (number) => {
    // Sanitize and format the number
    if (typeof number === 'number') {
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const sanitizedNumber = number.toString().replace(/[^0-9.,]/g, '');
    const normalizedNumber = sanitizedNumber.replace(/,/g, '');
    const floatNumber = parseFloat(normalizedNumber);

    if (isNaN(floatNumber)) {
        return '';
    }

    return floatNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



