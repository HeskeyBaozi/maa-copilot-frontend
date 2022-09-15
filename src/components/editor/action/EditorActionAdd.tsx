import { Button, Card, TextArea } from '@blueprintjs/core'
import { DevTool } from '@hookform/devtools'
import { CardTitle } from 'components/CardTitle'
import {
  EditorActionExecPredicateCostChange,
  EditorActionExecPredicateKills,
} from 'components/editor/action/EditorActionExecPredicate'
import { EditorActionOperatorDirection } from 'components/editor/action/EditorActionOperatorDirection'
import { EditorActionOperatorLocation } from 'components/editor/action/EditorActionOperatorLocation'
import { EditorActionTypeSelect } from 'components/editor/action/EditorActionTypeSelect'
import { EditorResetButton } from 'components/editor/EditorResetButton'
import { FormField, FormField2 } from 'components/FormField'
import {
  SubmitHandler,
  UseFieldArrayAppend,
  useForm,
  useWatch,
} from 'react-hook-form'

export interface EditorActionAddProps {
  append: UseFieldArrayAppend<CopilotDocV1.Action>
}

export const EditorActionAdd = ({ append }: EditorActionAddProps) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CopilotDocV1.Action>()

  const onSubmit: SubmitHandler<CopilotDocV1.Action> = (values) => {
    append(values)
    reset()
  }

  const type = useWatch({ control, name: 'type' })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-8 pt-4">
        <div className="flex items-center mb-4">
          <CardTitle className="mb-0" icon="add">
            <span>添加动作</span>
          </CardTitle>

          <div className="flex-1" />

          <EditorResetButton reset={reset} entityName="动作" />
        </div>

        {import.meta.env.DEV && <DevTool control={control} />}

        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1">
            <FormField2
              label="动作类型"
              field="type"
              error={errors.type}
              asterisk
            >
              <EditorActionTypeSelect control={control} name="type" />
            </FormField2>
          </div>
        </div>

        {(type === 'Deploy' || type === 'Skill' || type === 'Retreat') && (
          <>
            <div className="flex">
              <EditorActionExecPredicateKills control={control} />
              <EditorActionExecPredicateCostChange control={control} />
            </div>

            <div className="flex">
              <EditorActionOperatorLocation
                actionType={type}
                control={control}
                name="location"
              />
            </div>
          </>
        )}

        {type === 'Deploy' && (
          <div className="flex">
            <EditorActionOperatorDirection
              control={control}
              name="direction"
              actionType={type}
            />
          </div>
        )}

        <div className="flex">
          <div className="w-full">
            <FormField
              label="描述"
              field="doc"
              control={control}
              ControllerProps={{
                render: ({ field }) => (
                  <TextArea
                    fill
                    rows={2}
                    growVertically
                    large
                    id="doc"
                    placeholder="描述，可选。会显示在界面上，没有实际作用"
                    {...field}
                  />
                ),
              }}
            />
          </div>
        </div>

        <Button
          disabled={!isValid && !isDirty}
          intent="primary"
          type="submit"
          icon="add"
        >
          添加
        </Button>
      </Card>
    </form>
  )
}
