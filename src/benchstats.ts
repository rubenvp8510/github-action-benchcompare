import {promises as fs} from 'fs'
import {info} from '@actions/core'
import parse from 'csv-parse/lib/sync'
import table from 'markdown-table'

export type MetricBench = {[name: string]: string}[]
export type Results = MetricBench[]

export async function parseResults(resultsFile: string): Promise<Results> {
  const output = await fs.readFile(resultsFile, 'utf8')
  const lines = output.split('\n')
  const csvs: string[] = []
  let metric: string[] = []
  for (const line of lines) {
    if (line.trim() === '') {
      csvs.push(metric.join('\n'))
      metric = []
    } else {
      if (metric.length === 0) {
        metric.push(line.replace('±', 'variance'))
      } else {
        metric.push(line)
      }
    }
  }
  const metrics: Results = []
  for (const csv of csvs) {
    const test: MetricBench = parse(csv, {
      columns: true,
      skip_empty_lines: true
    })
    metrics.push(test)
  }
  info(JSON.stringify(metrics))
  return metrics
}

function hasUnits(result: MetricBench, metrics: string[]): boolean {
  for (const metric of metrics) {
    const regexp = new RegExp(`new ${metric} .*`)
    if (result.length > 0) {
      const keys = Object.keys(result[0])
      for (const key of keys) {
        info(key)
        if (regexp.test(key)) {
          return true
        }
      }
    }
  }
  return false
}

export function compareDeltasWithThreshold(
  metrics: Results,
  threshold: number,
  watchMetrics: string[]
): boolean {
  info('Compare deltas.')
  for (const metric of metrics) {
    if (hasUnits(metric, watchMetrics)) {
      for (const result of metric) {
        info(`Checking for  ${result.delta} vs ${threshold}`)
        const resultDelta: number = parseFloat(result.delta.replace('%', ''))
        if (resultDelta > threshold) {
          info(`Possible regression  ${result.delta} vs ${threshold}`)
          return true
        }
      }
    }
  }
  return false
}

export function renderMarkdownTable(results: Results): string {
  const tables: string[] = []
  for (const test of results) {
    if (test.length) {
      const tableArray: string[][] = []
      tableArray.push(Object.keys(test[0]))
      for (const result of test) {
        tableArray.push(Object.values(result))
      }
      tables.push(table(tableArray))
    }
  }
  return tables.join('\n\n')
}
