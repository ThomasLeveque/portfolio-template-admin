import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Table, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Project } from '../project.model';
import ProjectForm from '../project.form';
import { useProject } from '../project.context';

const ProjectsPage = () => {
  const {
    projects,
    projectsLoading,
    removeProject,
    addProject,
    removeProjectLoading
  } = useProject();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  return (
    <div className="projects page">
      <Title level={1}>My Projects</Title>
      <Table<Project>
        loading={projectsLoading || removeProjectLoading}
        dataSource={projects}
        scroll={{ x: 1300 }}
      >
        <Table.Column<Project> key="name" title="Name" dataIndex="name" width={120} />
        <Table.Column<Project> key="desc" title="Desc" dataIndex="desc" width={120} />
        <Table.Column<Project>
          key="formatedDate"
          title="Project date"
          dataIndex="formatedDate"
          width={120}
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
          render={(categories: string[]) => (
            <span>
              {categories.map((category: string) => {
                return (
                  <Tag
                    style={{ marginTop: '3px', marginBottom: '3px' }}
                    color="geekblue"
                    key={category}
                  >
                    {category.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )}
        />
        <Table.Column<Project>
          key="formatedDate"
          title="Project date"
          dataIndex="formatedDate"
          width={120}
        />
        <Table.Column<Project>
          key="createdAt"
          title="Created about"
          dataIndex="createdAt"
          width={120}
        />
        <Table.Column<Project>
          key="updatedAt"
          title="Updated about"
          dataIndex="updatedAt"
          width={120}
        />
        <Table.Column<Project>
          key="action"
          title="Action"
          dataIndex="action"
          fixed="right"
          width={120}
          render={(text: string, record: Project) => (
            <>
              <Button
                icon={<EditOutlined />}
                style={{ marginRight: '16px' }}
                type="primary"
                onClick={() => history.push(`${pathname}/${record.id}`)}
              />
              <Button
                icon={<DeleteOutlined />}
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
        initialValues={{ name: '', desc: '', date: '', skills: [], categories: [] }}
        submitText="Add"
        resetText="Reset"
      />
    </div>
  );
};

export default ProjectsPage;
