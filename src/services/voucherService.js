const voucherModel = require("@models/voucherModel");

const getVoucher = async (voucherCode) => {
    return await voucherModel.findOne({
        where: {
            code: voucherCode,
        },
    });
};

module.exports = {
    getVoucher,
};
