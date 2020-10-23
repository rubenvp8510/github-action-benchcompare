import core from '@actions/core'
import github from '@actions/github'

export async function comment(message: string): Promise<void> {
  const context = github.context
  if (context.payload.pull_request != null) {
    const pull_request_number = context.payload.pull_request.number
    const github_token = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(github_token)
    octokit.issues.getComment
    octokit.issues.getComment
    await octokit.issues.createComment({
      ...context.repo,
      issue_number: pull_request_number,
      body: message
    })
  }
}
