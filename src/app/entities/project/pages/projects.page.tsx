import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Table, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';

import { Project } from '../project.model';
import ProjectForm from '../project.form';
import { useProject } from '../project.context';
import { getDomain } from '../../../utils/parse-string.util';
import { useCategory } from '../../category/category.context';

const ProjectsPage = () => {
  const {
    projects,
    projectsLoading,
    removeProject,
    addProject,
    removeProjectLoading,
  } = useProject();
  const { categories } = useCategory();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  return (
    <div className="projects page">
      <Title level={1}>My Projects</Title>
      <Table<Project>
        loading={projectsLoading || removeProjectLoading}
        dataSource={projects}
        scroll={{ x: true }}
      >
        <Table.Column<Project> key="name" title="Name" dataIndex="name" width={140} />
        <Table.Column<Project> key="desc" title="Desc" dataIndex="desc" width={300} />
        <Table.Column<Project>
          key="projectUrl"
          title="Project Url"
          dataIndex="projectUrl"
          width={200}
          render={(projectUrl: string) => (
            <a target="_blank" rel="noopener noreferrer" href={projectUrl}>
              {getDomain(projectUrl)}
            </a>
          )}
        />
        <Table.Column<Project>
          key="projectSrc"
          title="Project Source"
          dataIndex="projectSrc"
          width={200}
          render={(projectSrc: string) => (
            <a target="_blank" rel="noopener noreferrer" href={projectSrc}>
              {getDomain(projectSrc)}
            </a>
          )}
        />
        <Table.Column<Project>
          key="date"
          title="Project date"
          dataIndex="date"
          width={140}
          render={(date: string) => format(new Date(date), 'MMMM yyyy')}
        />
        <Table.Column<Project>
          key="skills"
          title="Skills"
          dataIndex="skills"
          width={250}
          render={(skills: string[]) => (
            <span>
              {skills.map((skill: string) => {
                return (
                  <Tag
                    style={{ marginTop: '3px', marginBottom: '3px' }}
                    color="geekblue"
                    key={skill}
                  >
                    {skill.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )}
        />
        <Table.Column<Project>
          key="categories"
          title="Categories"
          dataIndex="categories"
          width={250}
          render={(categoryIds: string[]) => (
            <span>
              {categoryIds.map((categoryId: string) => {
                return (
                  <Tag
                    style={{ marginTop: '3px', marginBottom: '3px' }}
                    color="geekblue"
                    key={categoryId}
                  >
                    {categories[categoryId].name.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )}
        />
        <Table.Column<Project>
          key="images"
          title="Images"
          dataIndex="images"
          width={200}
          render={(imageIds: string[]) => (
            <span>
              {imageIds.length > 0 ? imageIds.length : 'No'}{' '}
              {imageIds.length === 1 ? 'image' : 'images'}
            </span>
          )}
        />
        <Table.Column<Project>
          key="createdAt"
          title="Created about"
          dataIndex="createdAt"
          width={140}
          render={(createdAt: number) => formatDistanceToNow(createdAt)}
        />
        <Table.Column<Project>
          key="updatedAt"
          title="Updated about"
          dataIndex="updatedAt"
          width={140}
          render={(updatedAt: number) => formatDistanceToNow(updatedAt)}
        />
        <Table.Column<Project>
          key="action"
          title="Action"
          dataIndex="action"
          fixed="right"
          width={140}
          render={(text: string, record: Project) => (
            <>
              <Button
                icon={<EditOutlined />}
                style={{ margin: '8px' }}
                type="primary"
                onClick={() => history.push(`${pathname}/${record.id}`)}
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ margin: '8px' }}
                type="danger"
                onClick={() => removeProject(record?.id as string)}
              />
            </>
          )}
        />
      </Table>
      <Title level={2}>Add a Project</Title>
      <ProjectForm
        callback={addProject}
        initialValues={{
          name: '',
          desc: '',
          projectUrl: '',
          projectSrc: '',
          date: '',
          skills: [],
          categories: [],
          images: [],
        }}
        submitText="Add"
        resetText="Reset"
      />
    </div>
  );
};

export default ProjectsPage;
