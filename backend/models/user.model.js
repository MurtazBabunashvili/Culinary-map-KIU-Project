const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },

    email: {
      type: String,
    },

    region: {
      type: String,
      enum: [
        "კახეთი",
        "იმერეთი",
        "სამეგრელო",
        "აჭარა",
        "სვანეთი",
        "რაჭა-ლეჩხუმი",
        "გურია",
        "მცხეთა-მთიანეთი",
        "შიდა ქართლი",
        "ქვემო ქართლი",
        "სამცხე-ჯავახეთი",
        "თბილისი",
        "აფხაზეთი",
      ],
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
