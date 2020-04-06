import React, { useState, useRef, useEffect } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { ProjectInitialState } from './project.initial-state';
import projectSchema from './project.schema';
import { Form, Input, ResetButton, SubmitButton, DatePicker, Select } from 'formik-antd';
import { Input as AntdInput, Button as AntdButton, Tag, Modal, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategory } from '../category/category.context';
import { Category } from '../category/category.model';
import { useImage } from '../../image/image.context';
import { Image } from '../../image/image.model';
import CardImage from '../../image/components/card-image.component';

interface IProps {
  callback: (values: ProjectInitialState) => Promise<void>;
  initialValues: ProjectInitialState;
  submitText: string;
  resetText: string;
}

const ProjectForm: React.FC<IProps> = ({ callback, initialValues, submitText, resetText }) => {
  const [skillsInputVisible, setSkillsInputVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [skillsInputValue, setSkillsInputValue] = useState<string>('');
  const inputRef = useRef<AntdInput>(null);
  const { categories } = useCategory();
  const { images } = useImage();
  const { Option } = Select;

  const hideModal = () => {
    setModalVisible(false);
  };

  const showModal = () => {
    setModalVisible(true);
  };

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
    return skills.filter((skill) => skill !== skillToRemove);
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
        const imageClicked = (image: Image, isAddImage: boolean): void => {
          if (isAddImage) {
            setFieldValue('images', [Object.assign({}, image), ...values.images]);
          } else {
            setFieldValue(
              'images',
              values.images.filter((valuesImage: Image) => valuesImage.id !== image.id)
            );
          }
        };

        const imagesSize: number = values.images.length;

        return (
          <>
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
                  {categories.map((category: Category) => (
                    <Option key={category.id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="images" label="Images">
                <>
                  <AntdButton icon={<PlusOutlined />} onClick={showModal} type="primary">
                    Add images ({imagesSize})
                  </AntdButton>
                  {imagesSize > 0 && (
                    <List
                      style={{ marginTop: 24 }}
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 4,
                        xxl: 6,
                      }}
                      dataSource={values.images}
                      renderItem={(image: Image) => (
                        <CardImage
                          size="small"
                          imageClicked={imageClicked}
                          selectedImages={values.images}
                          image={image}
                          isClickableImage={true}
                        />
                      )}
                    />
                  )}
                </>
              </Form.Item>
              <div className="buttons">
                <ResetButton>{resetText}</ResetButton>
                <SubmitButton>{submitText}</SubmitButton>
              </div>
            </Form>
            <Modal
              width="calc(100% - 100px)"
              style={{ top: 50, margin: '0 auto' }}
              bodyStyle={{
                height: 'calc(100vh - 208px)',
                overflowY: 'auto',
              }}
              title="Select images for this project"
              visible={modalVisible}
              onCancel={hideModal}
              footer={
                <AntdButton key="submit" type="primary" onClick={hideModal}>
                  Ok
                </AntdButton>
              }
            >
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 4,
                  xxl: 6,
                }}
                dataSource={images}
                renderItem={(image: Image) => (
                  <CardImage
                    imageClicked={imageClicked}
                    selectedImages={values.images}
                    image={image}
                    isClickableImage={true}
                  />
                )}
              />
            </Modal>
          </>
        );
      }}
    </Formik>
  );
};

export default ProjectForm;
