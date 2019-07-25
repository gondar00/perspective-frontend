import React from 'react'

import API from '../api'
import routes from '../api/routes'

import { Spin, Row, Col } from 'antd';

class Result extends React.Component {
  state = {
    score: {},
    finalScore: '',
    loading: true
  }

  groups = {
      1: ['extraversion', 'introversion'],
      2: ['sensing', 'intuition'],
      3: ['thinking', 'feeling'],
      4: ['judging', 'perceiving']
  }

  calculateScore = (answers) => {
    let score = {
      extraversion: 0,
      introversion: 0,
      sensing: 0,
      intuition: 0,
      thinking: 0,
      feeling: 0,
      judging: 0,
      perceiving: 0
    }

    answers.map(a => {
      score[a.dimension] = score[a.dimension] + a.answer
    })

    return score
  }

  calculateFinalScore = (score) => {
    let finalScore = '';

    Object.values(this.groups).map(group => {
      if(score[group[0]] >= score[group[1]]) {
        finalScore += group[0].charAt(0)
      } else {
        finalScore += group[1].charAt(0)
      }
    })

    console.log(finalScore)

    return finalScore
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    this.api = new API(routes.baseUrl)
    this.api.createEntity(routes.answers)
    this.api.endpoints.answers.getAll(user).then(({ data }) => {
      const score = this.calculateScore(data)
      const finalScore = this.calculateFinalScore(score)
      this.setState({
        loading: false,
        score,
        finalScore
      })
    })
  }

  getProgressBar = (type1, type2) => {
    const progressLeft = this.state.score[type1] >= this.state.score[type2]

    return (
      <div className="progress-holder">
        <div className="progress" />
        <style jsx>
         {`
           .progress-holder {
            display: inline-block;
            width: 150px;
            background-color: ${progressLeft ? "#f1f1f1": "#9e9e9e"};
           }

           .progress {
            background-color: ${progressLeft ? "#9e9e9e": "#f1f1f1"};
            height: 18px;
            width: 50%;
           }
         `}
        </style> 
      </div>
    )
  }

  getResults = () => {
    return Object.values(this.groups).map((group, index) => (
      <Row gutter={24}>
        <Col span={4}>
          {group[0]}
        </Col>
        <Col span={16}>
          {this.getProgressBar(group[0], group[1])}
        </Col>
        <Col span={4}>
          {group[1]}
        </Col>
      </Row>
    ))
  }

  render () {
    return (
      <Spin tip="Calculating your score..." spinning={this.state.loading}>
        <div className="container">
          <div className="left">
            <h3>Your Perspective</h3>
            <div>Your Perspective Type is <b className="finalScore">{this.state.finalScore}</b></div>
          </div>
          <div className="right">
            {this.getResults()}
          </div>
          <style jsx>
           {`
             .left {
              width: 25%;
              text-align: left;
              float: left;
             }

             .right {
              float: right;
             }

             .result {
              display: flex;
              justify-content: space-evenly;
              margin-bottom: 20px;
             }

              .container {
                border: 1px solid #e8e8e8;
                display: inline-block;
                margin-left: auto;
                margin-right: auto;
                width: 1200px;
                text-align: center;
                margin: 60px;
                padding: 60px;
             }

              .finalScore {
                text-transform: uppercase;
              }

              :global(.ant-col-4) {
                text-transform: capitalize;
              }
           `}
          </style>  
        </div>
      </Spin>
    )
  }
}

export default Result
