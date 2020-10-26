import {getInput} from '@actions/core'
import {context, getOctokit} from '@actions/github'

export async function cleanComment(): Promise<void> {
  if (context.payload.pull_request != null) {
    const pull_request_number = context.payload.pull_request.number
    const github_token = getInput('GITHUB_TOKEN')
    const octokit = getOctokit(github_token)
    const comments = await octokit.issues.listComments({
      ...context.repo,
      issue_number: pull_request_number
    })
    const benchComment = comments.data.filter(c => c.user.type === 'Bot')
    if (benchComment.length !== 0) {
      const comment_id = benchComment.pop()?.id
      comment_id &&
        octokit.issues.deleteComment({
          ...context.repo,
          comment_id
        })
    }
  }
}
export async function doComment(message: string): Promise<void> {
  if (context.payload.pull_request != null) {
    const pull_request_number = context.payload.pull_request.number
    const github_token = getInput('GITHUB_TOKEN')
    const octokit = getOctokit(github_token)
    const comments = await octokit.issues.listComments({
      ...context.repo,
      issue_number: pull_request_number
    })

    const benchComment = comments.data.filter(c => c.user.type === 'Bot')
    if (benchComment.length === 0) {
      await octokit.issues.createComment({
        ...context.repo,
        issue_number: pull_request_number,
        body: message
      })
    } else {
      const comment_id = benchComment[0].id
      await octokit.issues.updateComment({
        ...context.repo,
        comment_id,
        body: message
      })
    }
  }
}
