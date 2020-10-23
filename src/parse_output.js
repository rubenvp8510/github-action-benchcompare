"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBenchmarkStats = void 0;
const fs_1 = require("fs");
const core_1 = __importDefault(require("@actions/core"));
const cheerio_1 = __importDefault(require("cheerio"));
async function parseBenchmarkStats(resultsFile) {
    const output = await fs_1.promises.readFile(resultsFile, 'utf8');
    const $ = cheerio_1.default.load(output);
    $('tbody').each((_, metric) => {
        if ($(metric).find('.metric').length) {
            $(metric)
                .find('tr')
                .each((_n, suite) => {
                const cols = $(suite).find('td');
                if (cols.length > 1) {
                    core_1.default.debug('ok');
                }
            });
        }
    });
}
exports.parseBenchmarkStats = parseBenchmarkStats;
