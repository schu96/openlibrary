const classTypeSuffixes = {
    subjects: '--subject',
    subject_people: '--person',
    subject_places: '--place',
    subject_times: '--time'
}

/**
 * Affordance that displays a tag, and whether all selected works share the tag.
 *
 * Affordance has two states:
 *   1. Indeterminate : at least one, but not all, selected works share the given tag.
 *   2. All works tagged : All works have the given tag.
 *
 * Behavior on click:
 *   1. When the inital state is "Indeterminate", the subject is added to the `tags_to_add` form input. State changes to "All works tagged"
 *   2. When initial state is "All works tagged", the subject is added to the `tags_to_remove` form input. This row is removed from the DOM.
 *
 * To support bloom filtering, the visiblity of this affordance can be toggled.
 */
export class SelectedTag {

    /**
     * @param {String} tagType
     * @param {String} tagName
     * @param {boolean} allWorksTagged
     */
    constructor(tagType, tagName, allWorksTagged) {
        /**
         * Reference to the root element of this SelectedTag.
         *
         * @member {HTMLElement}
         */
        this.selectedTag

        /**
         * Type of the tag represented by this affordance.
         *
         * @member {String}
         */
        this.tagType = tagType

        /**
         * Name of the tag represented by this affordance.
         *
         * @member {String}
         */
        this.tagName = tagName

        /**
         * `true` if all selected works share the same tag.
         *
         * @member {boolean}
         */
        this.allWorksTagged = allWorksTagged

        /**
         * `true` if this component is visible on the page.
         *
         * @member {boolean}
         */
        this.isVisible = true

        /**
         * Reference to the root element of this SelectedTag.
         *
         * @member {HTMLElement}
         */
        this.selectedTag

        /**
         * Lowercase representation of the `tagName`.
         *
         * @readonly
         * @member {String}
         */
        this.LOWERCASE_TAG_NAME = tagName.toLowerCase()
    }

    /**
     * Renders a new SelectedTag, and attaches it to the DOM.
     */
    renderAndAttach() {
        const parentElem = document.createElement('div')
        parentElem.classList.add('selected-tag')
        const markup = `<span class="selected-tag__status selected-tag__status--${this.allWorksTagged ? 'all-tagged' : 'some-tagged'}"></span>
            <span class="selected-tag__type selected-tag__type${classTypeSuffixes[this.tagType]}"></span>
            <span class="selected-tag__name">${this.tagName}</span>`
        parentElem.innerHTML = markup

        const selectedTagsElem = document.querySelector('.selected-tag-subjects')
        selectedTagsElem.prepend(parentElem)
        this.selectedTag = parentElem
    }

    /**
     * Removes this SelectedTag from the DOM.
     */
    remove() {
        this.selectedTag.remove()
    }

    /**
     * Updates value of `this.allWorksTagged` and updates the view.
     *
     * @param {boolean} allWorksTagged `true` if all selected works share this tag.
     */
    updateAllWorksTagged(allWorksTagged) {
        this.allWorksTagged = allWorksTagged
        const statusIndicator = this.selectedTag.querySelector('.selected-tag__status')
        if (allWorksTagged) {
            statusIndicator.classList.remove('selected-tag__status--some-tagged')
            statusIndicator.classList.add('selected-tag__status--all-tagged')
        } else {
            statusIndicator.classList.remove('selected-tag__status--all-tagged')
            statusIndicator.classList.add('selected-tag__status--some-tagged')
        }
    }

    /**
     * Hides this SelectedTag.
     */
    hide() {
        this.selectedTag.classList.add('hidden')
        this.isVisible = false
    }

    /**
     * Shows this SelectedTag.
     */
    show() {
        this.selectedTag.classList.remove('hidden')
        this.isVisible = true
    }

    // XXX : Useful and needed?
    /**
     * Toggles visibility of this SelectedTag.
     */
    toggleVisibility() {
        this.selectedTag.classList.toggle('hidden')
        this.isVisible = !this.isVisible
    }

    /**
     * Checks if the tag name begins with the given string when doing a case insensitive
     * comparison.
     *
     * @param {String} searchString
     * @returns {boolean} `true` if the tag name starts with the given string (case insensitive)
     */
    tagNameStartsWith(searchString) {
        return this.LOWERCASE_TAG_NAME.startsWith(searchString.toLowerCase())
    }
}