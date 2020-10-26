import {doComment, cleanComment} from './github'
import {
  parseResults,
  compareDeltasWithThreshold,
  renderMarkdownTable
} from './benchstats'

import {getInput, info} from '@actions/core'

async function run(): Promise<void> {
  const bench_file = getInput('benchstat_file')
  const threshold = getInput('delta_threshold')
  const metrics = getInput('metrics').split(',')

  const suites = await parseResults(bench_file)

  if (compareDeltasWithThreshold(suites, parseFloat(threshold), metrics)) {
    info(`Building comment.`)
    const lines = [
      ':warning: **Performance Alert** :warning:',
      'Possible performance regression was detected'
    ]
    const resultsTable = renderMarkdownTable(suites)
    lines.push(resultsTable)
    const comment: string = lines.join('\n')
    info(comment)
    await doComment(comment)
  } else {
    await cleanComment()
  }
}

run()
