import * as core from '@actions/core'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name')
    const language: string = core.getInput('language')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Name      : ${name}`)
    core.debug(`Language  : ${language}`)

    const docker = "FROM node:lts-alpine\nWORKDIR /app\nCOPY . .\nEXPOSE 3000"
    const k8s = `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${name}\n  labels:\n    app: ${name}\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: ${name}\n  template:\n    metadata:\n      labels:\n        app: ${name}\n    spec:\n      containers:\n        - name: ${name}\n          image: nginx:1.14.2\n          ports:\n            - containerPort: 80`

    // Set outputs for other workflow steps to use
    core.setOutput('docker', docker)
    core.setOutput('k8s', k8s)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
