import React from 'react'

import API from '../api'
import routes from '../api/routes'

import { withRouter } from 'next/router'
import {
  Button,
  Radio,
  List,
  Input,
  message
} from 'antd'

class Home extends React.Component {
  state = {
    questions: [],
    answers: [],
    email: '',
    loading: true
  }

  componentDidMount() {
    this.api = new API(routes.baseUrl)
    this.createRoutes()
    this.api.endpoints.questions.getAll().then(({ data }) => {
      this.setState({
        loading: false,
        questions: data || [],
        answers: data.map(({ id }) => {
          return { question: id, answer: 1 }
        })
      })
    })
  }

  createRoutes = () => {
    this.api.createEntity(routes.questions)
    this.api.createEntity(routes.answers)
    this.api.createEntity(routes.users)
  }

  handleQuestion = id => (e) => {
    const answers = this.state.answers.map(answer => {
      if(answer.question === id) return { question: id, answer: e.target.value }
      return answer
    })

    this.setState({
      answers
    })
  }

  getQuestion = ({ id, question, dimension }) => {
    return (
      <List.Item>
        <div className="question">
          <div className="question-text">{question}</div>
          <span className="disagree-text">Disagree</span>
          <Radio.Group onChange={this.handleQuestion(id)} size="large" name="radiogroup" defaultValue={1}>
            <Radio value={1} />
            <Radio value={2} />
            <Radio value={3} />
            <Radio value={4} />
            <Radio value={5} />
            <Radio value={6} />
            <Radio value={7} />
          </Radio.Group>
          <span className="agree-text">Agree</span>
          <style jsx>
           {`
             .question {
              width: 100%;
             }

             .question-text {
              font-weight: 200;
              margin-bottom: 20px;
             }

             .container {
              margin-top: 20px;
              padding: 20px;
             }

             .disagree-text {
              color: red;
              margin-right: 15px;
             }

            .agree-text {
              color: green;
              margin-left: 10px;
             }
           `}
          </style>
        </div>
      </List.Item>
    )
  }

  getQuestionList = () => {
    return (
      <List
        bordered
        loading={this.state.loading}
        itemLayout="horizontal"
        dataSource={this.state.questions}
        renderItem={question => this.getQuestion(question)}
      />
    )
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    })
  }

  getEmailField = () => {
    return (
      <div className="question">
        <div className="question-text">Your Email</div>
        <Input allowClear placeholder="you@example.com" value={this.state.email} onChange={this.handleEmailChange} />
        <style jsx>
         {`
           .question {
            padding: 20px;
            border: 1px solid #e8e8e8;
           }

           .question-text {
            font-weight: 200;
            margin-bottom: 20px;
           }
         `}
        </style>
      </div>
    )
  }

  handleSave = () => {
    if(!this.state.email.trim()) {
      message.error('Email is required');
      return
    }

    const payload = { email: this.state.email };
    this.api.endpoints.users.create(payload).then(({ data }) => {
      const payload = this.state.answers.map(a => {
        a.user = data;
        return a;
      });

      this.api.endpoints.answers.create(payload).then(({ response }) => {
        this.props.router.push(`/result?user=${data}`)
      }) 
    })
  }

  getSubmitButton = () => {
    return (
      <Button type="primary" onClick={this.handleSave}>
        Save & Continue
        <style jsx>
         {`
           :global(.ant-btn-primary) {
            margin-top: 10px;
           }
         `}
        </style>
      </Button>
    )
  }

  render () {
    return (
      <div className="container">
        <div className="title">Discover Your Perspective</div>
        <div className="subtitle">Complete the 7 minute test and get a detailed report of your lenses on the world.</div>
        <div className="content">
          {this.getQuestionList()}
          {this.getEmailField()}
          {this.getSubmitButton()}
        </div>
        <style jsx>
         {`
           .container {
            margin-top: 20px;
            padding: 20px;
           }

           .title {
            font-weight: 500;
            color: blue;
           }

           .subtitle {

           }

            .content {
              margin-left: auto;
              margin-right: auto;
              width: 600px;
              text-align: center;
              padding: 20px;
           }
         `}
        </style>  
      </div>
    )
  }
}

export default withRouter(Home)
