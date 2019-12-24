import React, { Component } from "react";
//import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import formStyle from './form.module.css';
import { Select, Typography, Input, Form, InputNumber, DatePicker, Button } from 'antd';
import Moment from 'moment';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';

const { Option } = Select;

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}

class Map_choose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marker_lat: 45.4211,
      marker_lng: -75.6903
    }
  }
  render() {
    return (<GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 35.802357, lng: 51.393834 }}
      onClick={(e) => {
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        this.props.setVal({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        this.setState({
          marker_lat: e.latLng.lat(),
          marker_lng: e.latLng.lng()
        })
      }}>
      <Marker position={{ lat: this.state.marker_lat, lng: this.state.marker_lng }} />
    </GoogleMap>);
  }

}

const WrappedMap = withScriptjs(withGoogleMap(Map_choose));

class TheForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plzfield: ([{
        'field': {
          "name": "",
          "title": "",
          "type": ""
        },
        'getFieldDecorator': this.props.getFieldDecorator.getFieldDecorator
      },])
    };

  }


  render() {
    const getFieldDecorator = this.props.getFieldDecorator.getFieldDecorator;
    //let isInitialized = false;
    let theSubmitButton = <br></br>;
    let plzfield = ([{
      'field': {
        "name": "",
        "title": "",
        "type": ""
      },
      'getFieldDecorator': getFieldDecorator
    }]);
    if (this.props.form.fields) {
      //isInitialized = true;
      plzfield.pop();
      this.props.form.fields.forEach(element => {
        plzfield.push({
          'field': element,
          'getFieldDecorator': getFieldDecorator
        })
      });

      theSubmitButton = (
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      );
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout}
        onSubmit={(e) => {
          e.preventDefault();
          this.props.getFieldDecorator.validateFieldsAndScroll((err, values) => {
            if (!err) {
              plzfield.forEach((item) => {
                if (item.field.type === "Date" && (values[item.field.name] instanceof Moment)) {
                  let fieldName = item.field.name;
                  values[fieldName] = Moment(values[fieldName]).format('YYYY-MM-DD')
                }
              });
              console.log('Received values of form: ', values);
              fetch('http://localhost:9000/forms', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
              }).then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => console.log(err));
            }
          });
        }
        }
      >
        {
          Array.from(plzfield).map((item, index) => {
            let formItemID = (item.field.name) ? item.field.name.toString() : "0";
            // console.log(item.field.name);
            let req = false;
            let hasOptions = false;
            if (item.field.required) req = true;
            if (item.field.options) hasOptions = true;
            if (item.field.type === "Text") {
              let x;
              if (hasOptions) {
                x = (
                  <Select placeholder={`Please select a ${item.field.title}`}>
                    {
                      Array.from(item.field.options).map(opt => <Option value={opt.value}>{opt.label}</Option>)
                    }
                  </Select>
                );

              } else x = <Input />;
              return (
                <Form.Item label={item.field.title} key={index} htmlFor={item.field.name} >
                  {
                    item.getFieldDecorator(formItemID, {
                      rules: [
                        {
                          required: req,
                          message: `Please input ${item.field.title}!`,
                        },
                      ],
                    })(x)}
                </Form.Item>
              );
            }
            else if (item.field.type === "Number") {
              let x;
              if (hasOptions) {
                x = (
                  <Select placeholder={`Please select a ${item.field.title}`}>
                    {
                      Array.from(item.field.options).map(opt => <Option value={opt.value}>{opt.label}</Option>)
                    }
                  </Select>
                );

              } else x = <InputNumber />;
              return (
                <Form.Item label={item.field.title} key={index} htmlFor={item.field.name} >
                  {getFieldDecorator(formItemID, {
                    rules: [
                      {
                        required: req,
                        message: `Please input ${item.field.title}!`,
                      },
                    ],
                  })(x)}
                </Form.Item>
              );
            }
            else if (item.field.type === "Date") {
              let x;
              if (hasOptions) {
                x = (
                  <Select placeholder={`Please select a ${item.field.title}`}>
                    {
                      Array.from(item.field.options).map(opt => <Option value={opt.value}>{opt.label}</Option>)
                    }
                  </Select>
                );

              } else x = <DatePicker />;
              return (
                <Form.Item label={item.field.title} key={index} htmlFor={item.field.name}>
                  {getFieldDecorator(formItemID,
                    {
                      rules: [
                        {
                          type: 'object',
                          required: req,
                          message: 'Please select date!'
                        }
                      ],
                    }
                  )(x)}
                </Form.Item>
              );
            }
            else if (item.field.type === "Location") {
              let x;
              if (hasOptions) {
                x = (
                  <Select placeholder={`Please select a ${item.field.title}`}>
                    {
                      Array.from(item.field.options).map(opt => <Option value={opt.value}>{opt.label}</Option>)
                    }
                  </Select>
                );

              } else x = (<WrappedMap
                setVal={this.props.getFieldDecorator.setFieldsValue}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDjs0u02-62FMwrtxMxci5pc6PIubSyW28`}
                loadingElement={<div style={{ height: `200px` }} />}
                containerElement={<div style={{ height: `200px` }} />}
                mapElement={<div style={{ height: `200px`, width: `500px` }} />}
              />);
              return (
                <Form.Item label={item.field.title} key={index} htmlFor={item.field.name}>
                  {getFieldDecorator(formItemID,
                    {
                      initialValue: { lat: 20, lng: 20 },
                      rules: [
                        {
                          required: req,
                          message: 'Please select the location!'
                        }
                      ],
                    }
                  )(x)}
                </Form.Item>
              );
            }
            else return (<br></br>);
          })
        }
        < Form.Item {...tailFormItemLayout}>
          {theSubmitButton}
        </Form.Item >
      </Form >
    );
  }


}

let MakeWholeForm = Form.create({})(
  (props) => <TheForm getFieldDecorator={props.form} form={props.selectedform} />
);

class FormSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedFormJson: "" }
  }

  render() {
    var formsFile = (
      [
        {
          'url': 'x',
          'name': 'y'
        }
      ]
    );
    if (this.props.fdl) {
      formsFile = Array.from(this.props.fdl);
      //console.log(formsFile);
    }
    return (
      <div className={formStyle.flex_container}>
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a form"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            onSelect={value => {
              fetch('http://localhost:9000' + value, {
                method: 'GET',
              })
                .then(res => res.json())
                // .then(res => console.log(res))
                .then(res => this.setState({ selectedFormJson: res }))
                .catch(err => err);
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              Array.from(formsFile).map(form => <Option value={form.url} key={form.url}>{form.name}</Option>)
            }
          </Select>
        </div>
        <br></br>
        <div className={formStyle.form}>
          <MakeWholeForm selectedform={this.state.selectedFormJson} />
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
    this.title = "Request Forms (HW2)";
    this.formSelect = "Please select a form:";
  }


  callAPI() {
    fetch('http://localhost:9000/forms', {
      method: 'GET',
    },
    )
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);

  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header"></header> */}
        <div>
          <Typography.Title level={2}>{this.title}</Typography.Title>
          <br></br>
          <Typography.Text>{this.formSelect}</Typography.Text>
          <br></br>
          <FormSelector fdl={this.state.apiResponse.forms}></FormSelector>
        </div>
      </div>
    );
  }
}

export default App;
