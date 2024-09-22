import * as React from 'react'

import { cn } from '../../lib/utils'
import { HTMLSpacingPropertiesType } from '../../global/html.type'
import { Eye, EyeOff } from 'lucide-react'

export interface IptPropsType
  extends React.InputHTMLAttributes<HTMLInputElement>,
    HTMLSpacingPropertiesType {
  password?: boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  mask?: Function
  bgColor?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  change: Function
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  input: IptPropsType
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, input, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(true)

    const { mask, change, value, maxLength } = input

    const onChangeInputText = async (
      val: React.ChangeEvent<HTMLInputElement> | string,
    ) => {
      let handledValue = ''

      if (typeof val === 'string') {
        handledValue = val
      } else {
        handledValue = val.target.value
      }
      if (mask) {
        handledValue = mask(handledValue)
      }
      change(handledValue)
    }

    React.useEffect(() => {
      try {
        if (mask) {
          onChangeInputText(mask(value))
        }
      } catch (error) {
        console.log(error)
      }
    }, [value])

    return (
      <div
        className={cn(
          'flex h-10 w-full items-center rounded-md border border-input bg-background ring-offset-background file:border-0',
          className,
        )}
      >
        <input
          className={cn(
            'flex h-full w-full rounded-md bg-transparent px-3 py-2 text-sm file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent',
          )}
          type={type === 'password' && !showPassword ? 'text' : type}
          onChange={(e) => onChangeInputText(e)}
          value={value}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />
        {type !== 'password' ? null : (
          <div>
            <button
              type="button"
              className="flex h-full w-10 items-center justify-center"
            >
              {showPassword ? (
                <EyeOff
                  size={18}
                  className="mr-2"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="mr-2"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </button>
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
