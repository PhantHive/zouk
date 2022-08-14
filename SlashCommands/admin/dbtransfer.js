const mailVerif = require("../../assets/admin/mailsVerif.json");
const AES = require("crypto-js/aes");

module.exports = {
    name: "dbtransfer",
    run: async (client, interaction) => {


        MV.find({
                "email": { $exists: true }
            },
            async (err, mdata) => {

                if (err) console.log(err);
                console.log(mdata)


                mdata.forEach(student => {
                    let first = student.email.split(".")[0];
                    let last = student.email.split(".")[1];

                    student.first_name = AES.encrypt(first, process.env.AES).toString();
                    student.second_name = AES.encrypt(last, process.env.AES).toString();
                    student.email = AES.encrypt(student.email.toLowerCase(), process.env.AES).toString();

                    student.save()
                })


                console.log("DB transfer done");

            }
        )



    }
};