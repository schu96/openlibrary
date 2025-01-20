/* eslint-env node, es6 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { writeFileSync, readdirSync } from 'fs';
import { join } from 'path';


const BUILD_DIR = './static/build';
const PRODUCTION_DIR = join(BUILD_DIR, 'components/production');

const componentNames = getComponentNames();
componentNames.forEach(generateViteEntryFile)

const input = {};
componentNames.forEach(componentName => {
    input[componentName] = join(BUILD_DIR, `vue-tmp-${componentName}.js`);
});

export default defineConfig({
    plugins: [
        vue({ customElement: true }),
        legacy({ targets: ['defaults', 'not IE 11'] })
    ],
    build: {
        outDir: PRODUCTION_DIR,
        rollupOptions: {
            input,
            output: {
                entryFileNames: 'ol-[name].js',
                format: 'es'
            },
        },
    },
});

/**
 * Retrieves the names of Vue components in the specified directory.
 * Scans the './openlibrary/components' directory for files with a '.vue' extension,
 * and returns an array of component names without the extension.
 *
 * @returns {string[]} An array of component names, e.g., ['BarcodeScanner', 'BulkSearch'].
 */
function getComponentNames() {
    const files = readdirSync('./openlibrary/components');
    return files.filter(name => name.includes('.vue')).map(name => name.replace('.vue', ''));
}


/**
 * Generates a temporary entry file for Vite to build the web component
 * @param {string} componentName - Name of the Vue component to build
 * @throws {Error} If file creation fails
 */
function generateViteEntryFile(componentName) {
    const component_path = '../../openlibrary/components';
    const template = `
import { createWebComponentSimple } from '${component_path}/rollupInputCore.js';
import rootComponent from '${component_path}/${componentName}.vue';
createWebComponentSimple(rootComponent, '${componentName}');`;

    try {
        writeFileSync(join(BUILD_DIR, `vue-tmp-${componentName}.js`), template);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to generate Vite entry file: ${error.message}`);
        process.exit(1);
    }
}
