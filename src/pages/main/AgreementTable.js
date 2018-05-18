/**
 * Created by Xiaotao.Nie on 2018/5/15.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React, { Component } from 'react';
import { Table, Button } from 'antd';

import ClassNames from "classnames";

const columns = [
    { title: '协议名称', dataIndex: 'name', key: 'name' },
    { title: '协议状态', dataIndex: 'status', key: 'status', render: text => ["乙方发出要约","甲方完成签署","乙方申请结束","协议结束"][Number(text)] },
    { title: '资产数额', dataIndex: 'value', key: 'value', render: text => text / Math.pow(10, 18) },
    { title: '甲方地址', dataIndex: 'jiaAddress', key: 'jiaAddress' },
    { title: '乙方地址', dataIndex: 'yiAddress', key: 'yiAddress' },
    { title: '协议内容', dataIndex: 'agreementContent', key: 'agreementContent' },
    { title: '协议ID', dataIndex: 'id', key: 'id' },
];

class AgreementTable extends Component {

    constructor(props){
        super(props);
        this.clientWidth = document.documentElement.clientWidth;
        this.limitWidth = 680;
        this.state = {
            rowSize: this.clientWidth < this.limitWidth ? 2 : 5,
            selectIndex: -1,
        };
    }

    componentDidMount() {
        this.listenSizeChange()
    }

    listenSizeChange(){
        window.addEventListener('resize', (e) => {
            if(this.clientWidth !== document.documentElement.clientWidth) {
                // 改变每行显示的条目个数，从而保证响应式
                this.clientWidth = document.documentElement.clientWidth;
                if(this.clientWidth < this.limitWidth) {
                    this.setState({
                        rowSize: 2
                    })
                } else {
                    this.setState({
                        rowSize: 5
                    })
                }
            }
        })
    }

    renderExpand(record){

        let expandColumns = columns.slice(this.state.rowSize)

        return (<div>
            {expandColumns.map((item, index) =>
                <p key={index} style={{ margin: 0 }}>{item.title} : {record[item.dataIndex]}</p>
            )}
        </div>);

    }

    selectCertain(index, value){
        if(this.props.onSelected){
            this.props.onSelected(value)
        }
        this.setState({
            selectIndex: index,
        })
    }

    render(){

        let data = this.props.data || [];

        console.log("this.props.data:", this.props.data)

        return (
            <Table
                style={{marginTop:10}}
                columns={columns.slice(0, this.state.rowSize).concat([ { title: '操作', dataIndex: '', key: 'x', render: (text, record, index) => {console.log("text, record, index:", text, record, index); return <Button disabled={index === this.state.selectIndex} onClick={()=>{this.selectCertain(index, record)}}>选定</Button> } } ])}
                expandedRowRender={record => this.renderExpand(record)}
                dataSource={data}
            />
        )
    }
}

export default AgreementTable;