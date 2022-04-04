import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTask, deleteTask, getTasks, patchTask, searchTasks } from '../api/tasks-api'
import Auth from '../auth/Auth'
import { SearchTaskRequest } from '../types/SearchTaskRequest'
import { Task } from '../types/Task'

interface TasksProps {
  auth: Auth
  history: History
}

interface TasksState {
  tasks: Task[]
  newTaskName: string
  loadingTasks: boolean
  searchTask: string
}

export class Tasks extends React.PureComponent<TasksProps, TasksState> {
  state: TasksState = {
    tasks: [],
    newTaskName: '',
    loadingTasks: true,
    searchTask: ''
  }

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTask: event.target.value })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTaskName: event.target.value })
  }

  onEditButtonClick = (taskId: string) => {
    this.props.history.push(`/tasks/${taskId}/edit`)
  }

  onTaskSearch = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const searchTask = this.state.searchTask
      console.log('Search task with keyword: ', searchTask)

      if (searchTask) {
        console.log('Enter search task')
        const searchReq:SearchTaskRequest = {keyword: searchTask}

        const tasks = await searchTasks(this.props.auth.getIdToken(), searchReq)
        this.setState({
          tasks: tasks,
          loadingTasks: false
        })
      } else {
        console.log('Empty search. Enter fetch task')
        this.componentDidMount()
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(`Failed to fetch tasks: ${e.message}`)
      }
    }
  }

  onTaskCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTask = await createTask(this.props.auth.getIdToken(), {
        name: this.state.newTaskName,
        dueDate
      })
      this.setState({
        tasks: [...this.state.tasks, newTask],
        newTaskName: ''
      })
    } catch {
      alert('Task creation failed')
    }
  }

  onTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(this.props.auth.getIdToken(), taskId)
      this.setState({
        tasks: this.state.tasks.filter(task => task.taskId !== taskId)
      })
    } catch {
      alert('Task deletion failed')
    }
  }

  onTaskCheck = async (pos: number) => {
    try {
      const task = this.state.tasks[pos]
      await patchTask(this.props.auth.getIdToken(), task.taskId, {
        name: task.name,
        dueDate: task.dueDate,
        done: !task.done
      })
      this.setState({
        tasks: update(this.state.tasks, {
          [pos]: { done: { $set: !task.done } }
        })
      })
    } catch {
      alert('Task deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const tasks = await getTasks(this.props.auth.getIdToken())
      this.setState({
        tasks: tasks,
        loadingTasks: false
      })
    } catch (e: any) {
      alert(`Failed to fetch tasks: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TASKs</Header>

        {this.renderTaskSearch()}

        {this.renderCreateTaskInput()}

        {this.renderTasks()}
      </div>
    )
  }

  renderTaskSearch() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'search',
              content: 'Search task',
              onClick: this.onTaskSearch
            }}
            fluid
            actionPosition="left"
            placeholder="To find what you want..."
            onChange={this.handleSearch}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCreateTaskInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTaskCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To save the universe..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTasks() {
    if (this.state.loadingTasks) {
      return this.renderLoading()
    }

    return this.renderTasksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TASKs
        </Loader>
      </Grid.Row>
    )
  }

  renderTasksList() {
    return (
      <Grid padded>
        {this.state.tasks.map((task, pos) => {
          return (
            <Grid.Row key={task.taskId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTaskCheck(pos)}
                  checked={task.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {task.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {task.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(task.taskId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTaskDelete(task.taskId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {task.attachmentUrl && (
                <Image src={task.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
