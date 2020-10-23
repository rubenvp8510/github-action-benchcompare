"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = void 0;
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
async function comment(message) {
    const context = github_1.default.context;
    if (context.payload.pull_request != null) {
        const pull_request_number = context.payload.pull_request.number;
        const github_token = core_1.default.getInput('GITHUB_TOKEN');
        const octokit = github_1.default.getOctokit(github_token);
        octokit.issues.getComment;
        octokit.issues.getComment;
        await octokit.issues.createComment({
            ...context.repo,
            issue_number: pull_request_number,
            body: message
        });
    }
}
exports.comment = comment;
