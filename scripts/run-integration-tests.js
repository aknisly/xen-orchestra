#!/usr/bin/env node

'use strict'

const keyBy = require('lodash/keyBy')
const { spawn } = require('child_process')

const { getPackages } = require('./utils')

async function main() {
    const packages = keyBy(await getPackages(true), 'name')

    for (const pkg in packages) {
        const packageJson = require(`${packages[pkg].dir}/package.json`)

        if (packageJson?.devDependencies?.test || packageJson?.devDependencies?.tap) {
            const cmd = spawn('yarn', ['--cwd', `${packages[pkg].dir}`, 'test'])
            
            cmd.stdout.on('data', (data) => {
                console.log(`${data}`);
            })

            cmd.stderr.on('data', (data) => {
                console.error(`${data}`);
            })

            cmd.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            })
        }
    }
}

main()