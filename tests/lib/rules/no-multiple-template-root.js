/**
 * @fileoverview disallow adding multiple root nodes to the template
 * @author Przemyslaw Falowski (@przemkow)
 */
'use strict'

const rule = require('../../../lib/rules/no-multiple-template-root')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})
ruleTester.run('no-multiple-template-root', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><div>abc</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <div>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div v-if="foo">abc</div>\n    <div v-else>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div v-if="foo">abc</div>\n    <div v-else-if="bar">abc</div>\n    <div v-else>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: `<template>\n    <c1 v-if="1" />\n    <c2 v-else-if="1" />\n    <c3 v-else />\n</template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div><div v-else-if="bar"></div></template>'
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1439
    {
      filename: 'test.vue',
      code: `
      <template>
        <Link :to="to" class="flex items-center">
          <span v-if="prefixIcon || $slots.prefix" class="mr-1">
            <slot name="prefix">
              <FontAwesomeIcon v-if="prefixIcon" :icon="prefixIcon" fixedWidth />
            </slot>
          </span>

          <slot />
        </Link>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- comments -->
        <div>12333</div>
        <!-- comments -->
      </template>
      `,
      options: [{ disallowComments: false }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- comments -->
        <div>
          <!-- comments -->
          12333
        </div>
      </template>
      `,
      options: [{ disallowComments: false }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <!-- comments -->
          12333
          <span>
            <!-- comments -->
            12333
          </span>
        </div>
      </template>
      `,
      options: [{ disallowComments: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="for">
          <!-- comments -->
          12333
          <span>
            <!-- comments -->
            12333
          </span>
        </div>
        <div v-else>
          <!-- comments -->
          12333
        </div>
      </template>
      `,
      options: [{ disallowComments: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div></div><div></div></template>',
      errors: ['The template root requires exactly one element.']
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <div></div>\n    <div></div>\n</template>',
      errors: ['The template root requires exactly one element.']
    },
    {
      filename: 'test.vue',
      code: '<template>{{a b c}}</template>',
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: '<template><div></div>aaaaaa</template>',
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: '<template>aaaaaa<div></div></template>',
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in list"></div></template>',
      errors: ["The template root disallows 'v-for' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><slot></slot></template>',
      errors: ["The template root disallows '<slot>' elements."]
    },
    {
      filename: 'test.vue',
      code: '<template><template></template></template>',
      errors: ["The template root disallows '<template>' elements."]
    },
    {
      code: `
      <template>
        <!-- comments -->
        <div>12333</div>
        <!-- comments -->
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: [
        {
          message: 'The template root disallows comments.',
          line: 3
        },
        {
          message: 'The template root disallows comments.',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <!-- comments -->
        <div>
          12333
          <!-- comments -->
        </div>
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: [
        {
          message: 'The template root disallows comments.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <!-- comments -->
        <div v-if="for">
          <!-- comments -->
          12333
          <span>
            <!-- comments -->
            12333
          </span>
        </div>
        <!-- comments -->
        <div v-else>
          <!-- comments -->
          12333
        </div>
        <!-- comments -->
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: [
        {
          message: 'The template root disallows comments.',
          line: 3
        },
        {
          message: 'The template root disallows comments.',
          line: 12
        },
        {
          message: 'The template root disallows comments.',
          line: 17
        }
      ]
    },
    {
      code: `
      <template>
        <div>
          12333
          <!-- comments -->
        </div>
        <!-- comments -->
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: [
        {
          message: 'The template root disallows comments.',
          line: 7
        }
      ]
    },
    {
      code: `
      <template>
        <div />
        <!-- comments -->
        <div />
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: [
        {
          message: 'The template root disallows comments.',
          line: 4
        },
        {
          message: 'The template root requires exactly one element.',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <!-- When you have a comment in the root of your template in vue 3, 
        using $el will point to the first text comment instead of the actual DOM element.   -->
        <div>
          12333
          <!-- comments -->
        </div>
      </template>
      `,
      options: [{ disallowComments: true }],
      errors: ['The template root disallows comments.']
    }
  ]
})
