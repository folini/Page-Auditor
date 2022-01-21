// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
const classLoadingSpinnerDiv = 'loading-spinner'

export const show = (container: HTMLElement) => {
    Array.from(container.children).forEach(child => child.remove())
    const spinner = document.createElement('div')
    spinner.className = classLoadingSpinnerDiv
    container.append(spinner)
}

export const remove = (container: HTMLElement) => {
    container.querySelector('.loading-spinner')?.remove()
}
