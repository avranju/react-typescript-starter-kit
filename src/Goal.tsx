/// <reference path='../typings/tsd.d.ts' />
import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import 'es6-shim';

export interface Property {
  id: string;
  key: string;
  value: string;
}

export interface PropertyEditorProps {
  properties: Property[]
}

export interface PropertyEditorState {
    properties?: Property[];
}

export default class PropertyEditor extends React.Component<PropertyEditorProps, PropertyEditorState> {
  constructor(props: PropertyEditorProps) {
    super(props);
    this.state = {
      properties: [
        {
          id: _.uniqueId(),
          key: '',
          value: ''
        }
      ]
    };
  }

  private areRowsEmpty(...indices: number[]) {
    // return true if all the rows whose indices are given
    return indices
      .map(index => this.state.properties[index])
      .every(prop =>
        _.trim(prop.key).length === 0 && _.trim(prop.value).length === 0);
  }

  private handleOnFocus(prop: Property) {
    // if this is the last row in the table then add another
    // empty row;
    let propsLength = this.state.properties.length;
    if(this.state.properties[propsLength - 1].id === prop.id) {
      this.setState(Object.assign({}, this.state, {
        properties: [
          ...this.state.properties,
          {
            id: _.uniqueId(),
            key: '',
            value: ''
          }
        ]
      }));
    }

    // if this is not the last row and there are more than 2 rows and
    // this is not the penultimate row and the last two rows are empty then
    // remove last row
    else {
      if(
          propsLength > 2 &&
          prop.id !== this.state.properties[propsLength - 2].id &&
          this.areRowsEmpty(propsLength - 1, propsLength - 2)
        ) {
        let lastRow = this.state.properties[propsLength - 1];
        this.handleOnDelete(lastRow);
      }
    }
  }

  handleOnDelete = (prop: Property) => {
    this.setState(Object.assign({}, this.state, {
          properties: this.state
                          .properties
                          .filter(p => p.id !== prop.id)
        }));
  };

  handleOnPropChange = (prop: Property) => {
    this.setState(Object.assign({}, this.state, {
      properties: this.state.properties.map(p => p.id === prop.id ? {
        id: prop.id,
        key: prop.key,
        value: prop.value
      } : p)
    }));
  };

  public render() {
    // we render delete row buttons only if we have more than 1 row
    let enableDeleteRow = this.state.properties.length > 1;

    return (
      <div className='property-editor'>
        <table>
          <tbody>
            {
                this.state.properties.map(prop => {
                  return (
                      <tr key={prop.id}>
                        <td><input type='text'
                                   placeholder='key'
                                   onFocus={() => this.handleOnFocus(prop)}
                                   onChange={e => {
                                     this.handleOnPropChange({
                                       id: prop.id,
                                       key: (e.target as HTMLInputElement).value,
                                       value: prop.value
                                     });
                                   }}
                                   value={prop.key} /></td>
                        <td><input type='text'
                                   placeholder='value'
                                   onFocus={() => this.handleOnFocus(prop)}
                                   onChange={e => {
                                     this.handleOnPropChange({
                                       id: prop.id,
                                       key: prop.key,
                                       value: (e.target as HTMLInputElement).value
                                     });
                                   }}
                                   value={prop.value} /></td>
                        {
                          enableDeleteRow ? (
                              <td className='close-button'
                                  title='Delete Row'
                                  onClick={() => this.handleOnDelete(prop)}>
                                  {String.fromCharCode(10006)}
                              </td>
                            ) : null
                        }
                      </tr>
                  );}
                )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<PropertyEditor />, document.getElementById('react'));
