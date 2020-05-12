import React, { useState, useRef, useEffect } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Form, Input, ResetButton, SubmitButton, DatePicker, Select } from 'formik-antd';
import { Input as AntdInput, Button as AntdButton, Tag, Modal, List, Upload } from 'antd';

import { ProjectInitialState } from './project.initial-state';
import projectSchema from './project.schema';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useCategory } from '../category/category.context';
import { useImage } from '../../image/image.context';
import { Image } from '../../image/image.model';
import CardImage from '../../image/components/card-image.component';
import { RcFile } from 'antd/lib/upload/interface';

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
  const { images, uploadImage, addImageLoading } = useImage();
  const { Option } = Select;

  const hideModal = (): void => {
    setModalVisible(false);
  };

  const showModal = (): void => {
    setModalVisible(true);
  };

  const showSkillsInput = (): void => {
    setSkillsInputVisible(true);
  };

  useEffect(() => {
    if (skillsInputVisible) {
      inputRef.current?.focus();
    }
  }, [skillsInputVisible]);

  const handleSkillsInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSkillsInputValue(event.target.value);
  };

  const handleRemoveSkill = (skills: string[], skillToRemove: string): string[] => {
    return skills.filter((skill) => skill !== skillToRemove);
  };

  const handleAddSkill = (skills: string[]): string[] => {
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
        const imageClicked = (imageId: string, isAddImage: boolean): void => {
          if (isAddImage) {
            setFieldValue('images', [imageId, ...values.images]);
          } else {
            setFieldValue(
              'images',
              values.images.filter((valuesImageId: string) => valuesImageId !== imageId)
            );
          }
        };

        const uploadImageAndAddToProject = async (file: RcFile) => {
          const imageId = await uploadImage(file);
          if (!imageId) return;
          setFieldValue('images', [imageId, ...values.images]);
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
              <Form.Item name="projectUrl" label="Project Url">
                <Input name="projectUrl" placeholder="Project Url" />
              </Form.Item>
              <Form.Item name="projectSrc" label="Project Source">
                <Input name="projectSrc" placeholder="Project Source" />
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
                  {Object.keys(categories).map((categoryId: string) => (
                    <Option key={categoryId} value={categoryId}>
                      {categories[categoryId].name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="images" label="Images">
                <>
                  <AntdButton icon={<PlusOutlined />} onClick={showModal} type="primary">
                    Add images ({imagesSize})
                  </AntdButton>
                  <Upload
                    name="projectImage"
                    showUploadList={false}
                    beforeUpload={(file: RcFile) => {
                      uploadImageAndAddToProject(file);
                      return false;
                    }}
                  >
                    <AntdButton
                      style={{ marginLeft: 16 }}
                      loading={addImageLoading}
                      icon={<UploadOutlined />}
                    >
                      Click to Upload
                    </AntdButton>
                  </Upload>
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
                      dataSource={values.images.map((imageId: string) => images[imageId])}
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
                dataSource={Object.keys(images).map((imageId: string) => images[imageId])}
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
