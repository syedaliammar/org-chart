const base = require("./node_modules/@mendix/pluggable-widgets-tools/configs/eslint.js.base.json");

const config = {
    ...base
};

config["rules"]["no-unused-vars"] = [
    "error",
    {
        "varsIgnorePattern": "Component"
    },
    {
        "varsIgnorePattern": "createElement"
    }
];

module.exports = config;