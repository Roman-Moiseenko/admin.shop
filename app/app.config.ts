export default defineAppConfig({
    ui: {
        container: {
            base: 'w-full'
        },
        colors: {
            primary: 'emerald',
            neutral: 'zinc',
            info: 'slate',
            secondary: 'blue'
        },
        link: {
            base: 'focus-visible:outline-primary',
            variants: {
                active: {
                    true: 'text-primary',
                    false: 'text-muted',
                },
                disabled: {
                    true: 'cursor-not-allowed opacity-75'
                }
            },
            compoundVariants: [
                {
                    active: false,
                    disabled: false,
                    class: [
                        'hover:text-default',
                        'transition-colors',
                        'text-cyan-600',
                        'font-bold'
                    ]
                }
            ]
        },
        theme: {
            colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
        },
        button: {
            slots: {
                base: 'cursor-pointer',
            }
        },
        dropdownMenu: {
            slots: {
                item: 'cursor-pointer',
            }
        }
    }
})
