import React, { useState, useRef, useEffect } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { ProjectInitialState } from './project.initial-state';
import projectSchema from './project.schema';
import { Form, Input, ResetButton, SubmitButton, DatePicker, Select } from 'formik-antd';
import { Input as AntdInput, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategory } from '../category/category.context';
import { Category } from '../category/category.model';

interface IProps {
  callback: (values: ProjectInitialState) => Promise<void>;
  initialValues: ProjectInitialState;
  submitText: string;
  resetText: string;
}

const ProjectForm: React.FC<IProps> = ({ callback, initialValues, submitText, resetText }) => {
  const [skillsInputVisible, setSkillsInputVisible] = useState<boolean>(false);
  const [skillsInputValue, setSkillsInputValue] = useState<string>('');
  const inputRef = useRef<AntdInput>(null);
  const { categories } = useCategory();
  const { Option } = Select;

  const showSkillsInput = () => {
    setSkillsInputVisible(true);
  };

  useEffect(() => {
    if (skillsInputVisible) {
      inputRef.current?.focus();
    }
  }, [skillsInputVisible]);

  const handleSkillsInputChange = (event: any) => {
    setSkillsInputValue(event.target.value);
  };

  const handleRemoveSkill = (skills: string[], skillToRemove: string): string[] => {
    return skills.filter(skill => skill !== skillToRemove);
  };

  const handleAddSkill = (skills: string[]): string[] | undefined => {
    if (skillsInputValue && skills.indexOf(skillsInputValue) === -1) {
      setSkillsInputValue('');
      setSkillsInputVisible(false);
      return [...skills, skillsInputValue];
    }
    setSkillsInputVisible(false);
    return skills;
  };

  return (
    <Formik<ProjectInitialState>
      onSubmit={async (
        values: ProjectInitialState,
        { setSubmitting, resetForm }: FormikHelpers<ProjectInitialState>
      ) => {
        await callback(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={projectSchema}
      initialValues={initialValues}
      enableReinitialize
    >
      {({ values, setFieldValue }: FormikProps<ProjectInitialState>) => {
        return (
          <Form>
            <Form.Item name="name" required label="Name">
              <Input name="name" placeholder="Name" />
            </Form.Item>
            <Form.Item name="desc" required label="Desc">
              <Input name="desc" placeholder="Description" />
            </Form.Item>
            <Form.Item name="date" required label="Date">
              <DatePicker picker="month" name="date" />
            </Form.Item>
            <Form.Item name="skills" label="Skills">
              <>
                {values.skills.map((skill: string, index: number) => (
                  <Tag
                    key={skill + index}
                    closable
                    onClose={(event: any) => {
                      event.preventDefault();
                      setFieldValue('skills', handleRemoveSkill(values.skills, skill));
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
                {skillsInputVisible ? (
                  <AntdInput
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 100 }}
                    value={skillsInputValue}
                    onChange={handleSkillsInputChange}
                    onBlur={() => setFieldValue('skills', handleAddSkill(values.skills))}
                    onPressEnter={() => setFieldValue('skills', handleAddSkill(values.skills))}
                  />
                ) : (
                  <Tag onClick={showSkillsInput} className="add-skill">
                    <PlusOutlined /> New skill
                  </Tag>
                )}
              </>
            </Form.Item>
            <Form.Item name="categories" required label="Categories">
              <Select mode="multiple" placeholder="Select categories" name="categories">
                {categories.map((category: Category, index: number) => (
                  <Option key={`${category.name}${index}`} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className="buttons">
              <ResetButton>{resetText}</ResetButton>
              <SubmitButton>{submitText}</SubmitButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProjectForm;
