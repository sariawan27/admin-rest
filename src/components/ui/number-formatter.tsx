
// TODO use react-number-format instead of this

function formatID(amount: any) {
    const idFormatter = new Intl.NumberFormat('id-ID')
    return idFormatter.format(amount)
};

export default as numberFormatter;