import React, { Component } from 'react';
import './Main.less';
import { Link } from 'react-router';

import Header from '../../components/header/Header'
import axios from "axios/index";

import ClassNames from "classnames"

import dayjs from 'dayjs'

import { contractAddress, contractConfig, preURL, CommonCallStr } from "../../config";
import AgreementTable from "./AgreementTable"

import { Steps, Input, Button, Select, Tabs, Timeline, message, Modal } from 'antd';
const Step = Steps.Step;
const { TextArea } = Input;
const { TabPane } = Tabs;
const Option = Select.Option;

const Base64 = {
    utf8ToBase64:function (str){
        return btoa(unescape(encodeURIComponent(str)));
    },
    base64ToUtf8: function(str){
        return decodeURIComponent(escape(atob(str)));
    }
}


const createID = function(){
    let code = '';
    //设置长度，这里看需求，我这里设置了4
    let codeLength = 12;
    //设置随机字符
    let random = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z'];
    //循环codeLength 我设置的4就是循环4次
    for(let i = 0; i < codeLength; i++){
        //设置随机数范围,这设置为0 ~ 36
        let index = Math.floor(Math.random()*36);
        //字符串拼接 将每次随机的字符 进行拼接
        code += random[index];
    }
    return Date.now() + code + "";
};

class Main extends Component {

    constructor(props){
        super(props)

        let ifSupportExtPay;
        if(typeof(webExtensionWallet) === "undefined"){
            ifSupportExtPay = false;
        } else {
            ifSupportExtPay = true;
        }

        this.state = {
            ifSupportExtPay,
            // PartA 和 PartB 是互相独立 不干扰的
            PartA:{ // 甲方
                beginStepCurrent: 0,
                endStepCurrent: 0,
                beginStep1:{
                    searched: false,
                    table:[],
                    content:{
                        name:"",
                        jiaAddress: "",
                        yiAddress: "",
                        agreementContent: "",
                        value: 0,
                        ifSendYi: 1
                    }
                },
                endStep1:{
                    searched: false,
                    table:[],
                    content:{
                        name:"",
                        jiaAddress: "",
                        yiAddress: "",
                        agreementContent: "",
                        value: 0,
                        ifSendYi: 1
                    }
                }
            },
            PartB:{ // 乙方
                beginStepCurrent: 0,
                endStepCurrent: 0,
                beginStep1:{
                    searched: false,
                    table:[],
                    content:{
                        name:"",
                        jiaAddress: "",
                        yiAddress: "",
                        agreementContent: "",
                        value: 0,
                        ifSendYi: 1
                    }
                },
                endStep1:{
                    searched: false,
                    table:[],
                    content:{
                        name:"",
                        jiaAddress: "",
                        yiAddress: "",
                        agreementContent: "",
                        value: 0,
                        ifSendYi: 1
                    }
                }
            },
            beginAgreement: true,
            endAgreement: false,
        }
    }


    componentDidMount() {
    }

    switchOptions(begin, end){
        this.setState({
            beginAgreement: begin,
            endAgreement:end
        })
    }

    // begin & end 通用
    changeContent(part, caseName, attrName, attrValue){
        switch (part){
            case "PartB":
                let { PartB } = this.state;
                switch (caseName){
                    case "beginStep1":
                        PartB.beginStep1.content[attrName] = attrValue;
                        this.setState(PartB);
                        return;
                    case "endStep1":
                        PartB.endStep1.content[attrName] = attrValue;
                        this.setState(PartB);
                        return;
                    default:
                        return;
                }
                return;
            case "PartA":
                let { PartA } = this.state;
                switch (caseName){
                    case "beginStep1":
                        PartA.beginStep1.content[attrName] = attrValue;
                        this.setState(PartA);
                        return;
                    case "endStep1":
                        PartA.endStep1.content[attrName] = attrValue;
                        this.setState(PartA);
                        return;
                    default:
                        return;
                }
                return;
            default:
                return;
        }
    }

    beginChangeStep(part, index){
        if(part === "PartB") {
            let PartB = this.state.PartB;
            if (index === 1) {
                // 如果是切换到下一步，我们需要确定一些内容是否为空
                if (!this.state.PartB.beginStep1.content.jiaAddress) {
                    message.error("请填入甲方 NAS 地址");
                    return;
                }

                if (!this.state.PartB.beginStep1.content.yiAddress) {
                    message.error("请填入乙方 NAS 地址");
                    return;
                }

                if (!this.state.PartB.beginStep1.content.value) {
                    message.error("请填入冻结资产数额 （NAS）");
                    return;
                }

                //TODO 这个时候生成参数

                if(!PartB.beginStep1.content.id)
                    PartB.beginStep1.content.id = createID();

                let result = {...PartB.beginStep1.content}

                result.name = Base64.utf8ToBase64(result.name)
                result.agreementContent = Base64.utf8ToBase64(result.agreementContent)

                console.log(JSON.stringify(result))
            }

            PartB.beginStepCurrent = index;
            this.setState({
                PartB
            })
        }

        if(part === "PartA"){
            if(index === 1){
                if (!this.state.PartA.beginStep1.content.yiAddress) {
                    message.error("请查询并选择您要签署的协议");
                    return;
                }
            }
            let PartA = this.state.PartA;
            PartA.beginStepCurrent = index;
            this.setState({
                PartA
            })
        }
    }

    endChangeStep(part, index){
        if(part === "PartB"){
            if(index === 1){
                if (!this.state.PartB.endStep1.content.jiaAddress) {
                    message.error("请查询并选择您要签署的协议");
                    return;
                }
            }
            let PartB = this.state.PartB;
            PartB.endStepCurrent = index;
            this.setState({
                PartB
            })
        }
        if(part === "PartA"){
            if(index === 1){
                if (!this.state.PartA.endStep1.content.yiAddress) {
                    message.error("请查询并选择您要签署的协议");
                    return;
                }
            }
            let PartA = this.state.PartA;
            PartA.endStepCurrent = index;
            this.setState({
                PartA
            })
        }
    }

    success(part, beginorend){

        let content;

        if(beginorend === "begin"){
            content = "您的协议已经签署完毕，请在您的钱包中确认交易结果"
        } else {
            content = "您的协议已经结束，请在您的钱包中确认交易结果"
        }

        Modal.success({
            title: '签署完成',
            content: content,
        });

        // 签署完成后，应当清空数据并返回至第一步

        if(part === "PartA"){
            let PartA = this.state.PartA;

            let step = beginorend === "begin" ? "beginStep1" : "endStep1";

            if(beginorend === "begin"){
                PartA.beginStepCurrent = 0;
            } else {
                PartA.endStepCurrent = 0;
            }

            PartA[step].searched = false;
            PartA[step].table = []
            PartA[step].content = {
                table:[],
                name:"",
                jiaAddress: "",
                yiAddress: "",
                agreementContent: "",
                value: 0,
                ifSendYi: 1
            };

            this.setState({
                PartA
            })
        }

        if(part === "PartB"){
            let PartB = this.state.PartB;

            let step = beginorend === "begin" ? "beginStep1" : "endStep1";

            if(beginorend === "begin"){
                PartB.beginStepCurrent = 0;
            } else {
                PartB.endStepCurrent = 0;
            }

            PartB[step].searched = false;
            PartB[step].table = []
            PartB[step].content = {
                table:[],
                name:"",
                jiaAddress: "",
                yiAddress: "",
                agreementContent: "",
                value: 0,
                ifSendYi: 1
            };

            this.setState({
                PartB
            })
        }
    }

    searchAgreementFromChain(nasAddr, part, beginorend){

        let callArgs = [nasAddr]

        if(part === "PartA"){
            callArgs.push("jia");
        } else {
            callArgs.push("yi");
        }

        axios.post(preURL + CommonCallStr, {
            dappAddress: contractAddress,
            args: callArgs,
            funcName:"getAgreementsByAddr"
        },).then((responseText) => {
            console.log('simulateCall result:', responseText.data)

            let table = JSON.parse(responseText.data);

            for(let i = 0; i < table.length; i += 1){
                table[i].key = i;
                table[i].agreeID =  table[i].id;
                table[i].name = Base64.base64ToUtf8(table[i].name);
                table[i].agreementContent = Base64.base64ToUtf8(table[i].agreementContent)
            }

            console.log("table:", table);

            if(part === "PartA"){
                let PartA = this.state.PartA;

                if(beginorend === "begin"){
                    PartA.beginStep1.searched = true;
                    PartA.beginStep1.table = table
                } else {
                    PartA.endStep1.searched = true;
                    PartA.endStep1.table = table
                }
                this.setState({
                    PartA
                })
            }

            if(part === "PartB"){
                let PartB = this.state.PartB;

                if(beginorend === "begin"){
                    PartB.beginStep1.searched = true;
                    PartB.beginStep1.table = table
                } else {
                    PartB.endStep1.searched = true;
                    PartB.endStep1.table = table
                }
                this.setState({
                    PartB
                })
            }
        })

        // window.sync(contractAddress,"getAgreementsByAddr",JSON.stringify(callArgs)).then((result) => {
        //     console.log("call result:", result);
        // })

        // window.nebPay.simulateCall(contractAddress, 0, "getAgreementsByAddr", JSON.stringify(callArgs), {
        //     qrcode: {
        //         showQRCode: false
        //     },
        //     goods: {
        //         name: "test",
        //         desc: "test goods"
        //     },
        //     callback:window.callbackUrl, //don't need to set callback for simulateCall
        //     listener: (result) => {
        //         console.log("simulateCall result:", result);
        //     }  //set listener for extension transaction result
        // });

        //
        // let table = [
        //     { key: 1, name: '房屋租赁合同', jiaAddress: 'n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL', status:"invalid", value: 111, yiAddress:"n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL",agreementContent: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
        //     { key: 2, name: '这是一个样例合同', jiaAddress: 'n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL', status:"invalid", value: 122, yiAddress:"n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL",agreementContent: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
        //     { key: 3, name: '这是一个测试合同', jiaAddress: 'n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL', status:"invalid", value: 133, yiAddress:"n21c2t5nXA1xKB3EX1t1UqBZCCQEtvFE9KL",agreementContent: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
        // ];


    }

    onSelectedFromChain(value, part, beginorend){

        console.log("onSelectedFromChain:", value, part, beginorend)

        if(part === "PartA"){
            let PartA = this.state.PartA;

            if(beginorend === "begin"){
                PartA.beginStep1.content = value;
            } else {
                PartA.endStep1.content = value;
            }
            this.setState({
                PartA
            })
        }

        if(part === "PartB"){
            let PartB = this.state.PartB;

            if(beginorend === "begin"){
                PartB.beginStep1.content = value;
            } else {
                PartB.endStep1.content = value;
            }
            this.setState({
                PartB
            })
        }
        }

    payByExt(part, beginorend){

        let to = contractAddress;
        let value;
        let callFunction;
        let callArgs;
        console.log("window.nebPay:",window.nebPay)

        if(part === "PartA"){
            if(beginorend === "begin"){
                value = this.state.PartA.beginStep1.content.value / Math.pow(10, 18);
                callFunction = "confirmNewAgreement";
                console.log("this.state.PartA.beginStep1.content:",this.state.PartA.beginStep1.content)
                callArgs = JSON.stringify([this.state.PartA.beginStep1.content.id])
            }
            else if(beginorend === "end"){
                value = 0;
                callFunction = "confirmEndAgreement";
                callArgs = JSON.stringify([this.state.PartA.endStep1.content.id])
            }

        } else if(part === "PartB"){

            if(beginorend === "begin"){
                value = 0;
                callFunction = "newAgreement";
                callArgs = JSON.stringify([this.state.PartB.beginStep1.content.id,{
                    name:Base64.utf8ToBase64(this.state.PartB.beginStep1.content.name),
                    jiaAddress: this.state.PartB.beginStep1.content.jiaAddress,
                    yiAddress: this.state.PartB.beginStep1.content.yiAddress,
                    agreementContent: Base64.utf8ToBase64(this.state.PartB.beginStep1.content.agreementContent),
                    value: this.state.PartB.beginStep1.content.value,
                    ifSendYi: this.state.PartB.beginStep1.content.ifSendYi
                }])
            }
            else if(beginorend === "end"){
                value = 0;
                callFunction = "endAgreement";
                callArgs = JSON.stringify([this.state.PartB.endStep1.content.id])
            }
        } else {
            message.error("生成交易出现错误，请稍后重试");
            return ;
        }

        if(!callFunction){
            message.error("生成交易出现错误，请稍后重试");
            return;
        }

        // window.nebPay.simulateCall(to, value, callFunction, callArgs, {
        //         qrcode: {
        //             showQRCode: false
        //         },
        //         goods: {
        //             name: "test",
        //             desc: "test goods"
        //         },
        //         callback:window.callbackUrl, //don't need to set callback for simulateCall
        //         listener: (result) => {
        //             console.log("simulateCall result:", result);
        //         }  //set listener for extension transaction result
        // });

        window.nebPay.call(to, value, callFunction, callArgs, {
            qrcode: {
                showQRCode: false
            },
            goods: {
                name: "Betupchain",
                desc: "Join a bet"
            },
            //callback: cbCallDapp
            listener: (result)=>{
                console.log("result:", result)
                if(result.txhash){
                    this.success(part, beginorend)
                }
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <div className='activities-container'>

                    <div className="options-select">
                        <div className={ClassNames("options",{"active":this.state.beginAgreement})} onClick={()=>{this.switchOptions(true, false)}}>签署协议</div>
                        <div className="divider"> | </div>
                        <div className={ClassNames("options",{"active":this.state.endAgreement})} onClick={()=>{this.switchOptions(false, true)}}>完成协议</div>
                    </div>

                    {this.state.beginAgreement && // 签署协议部分
                    <div className="step-container">
                        <Tabs defaultActiveKey="1" size={'large'}>
                            <TabPane tab="发起签署（乙方）" key="1">
                                <Steps current={this.state.PartB.beginStepCurrent} style={{padding:"10px 20px 0"}}>
                                    <Step title="乙方填写协议基本信息"/>
                                    <Step title="乙方签署协议"/>
                                </Steps>
                                {this.state.PartB.beginStepCurrent === 0 &&
                                <div className="step-content-container">
                                    <div className="input-group">
                                        <label>乙方 NAS 地址:</label>
                                        <Input type="text" className="common-input" value={this.state.PartB.beginStep1.content.yiAddress}
                                               onChange={(e) => {this.changeContent("PartB","beginStep1", "yiAddress", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <label>甲方 NAS 地址:</label>
                                        <Input type="text" className="common-input" value={this.state.PartB.beginStep1.content.jiaAddress}
                                               onChange={(e) => {this.changeContent("PartB","beginStep1", "jiaAddress", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <label>协议名称:</label>
                                        <Input type="text" className="common-input" value={this.state.PartB.beginStep1.content.name}
                                               onChange={(e) => {this.changeContent("PartB","beginStep1", "name", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <label>冻结资产数额 （NAS）:</label>
                                        <Input type="number" className="common-input" value={this.state.PartB.beginStep1.content.value}                                                                         onChange={(e) => {this.changeContent("PartB","beginStep1", "value", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <label>是否在协议结束后将资产转回乙方账户（否则会退回至甲方账户）</label>
                                        <Select defaultValue={this.state.PartB.ifSendYi}
                                                onChange={(value) => {this.changeContent("PartB","beginStep1", "ifSendYi", value)}} className="common-select" >
                                            <Option value={1}>是</Option>
                                            <Option value={0}>否 </Option>
                                        </Select>
                                    </div>
                                    <div className="input-group">
                                        <label>协议具体说明:</label>
                                        <TextArea rows={4} value={this.state.PartB.beginStep1.content.agreementContent}
                                                  onChange={(e) => {this.changeContent("PartB","beginStep1", "agreementContent", e.target.value)}}
                                                  placeholder={"建议尽可能精简字符，字符数量越多手续费越高"} />
                                    </div>
                                    <p>备注：请注意协议地址不可输入错误，不可简写缩写，否则可能会有资金遗失的风险！</p>
                                    <div className="input-group">
                                        <Button type="primary" className="small-button" onClick={()=>{this.beginChangeStep("PartB",1)}}>下一步</Button>
                                    </div>
                                </div>
                                }

                                {this.state.PartB.beginStepCurrent === 1 &&
                                <div className="step-content-container">
                                    <p><b>协议内容</b></p>
                                    <p>{this.state.PartB.beginStep1.content.agreementContent}</p>
                                    <p><b>协议履行完成后，款项会由合约地址直接{this.state.PartB.beginStep1.content.ifSendYi ? "转入乙方" : "转回甲方"}账户</b></p>
                                    <Tabs defaultActiveKey="2" size={'large'}>
                                        <TabPane tab="平台支付" key="1">
                                            <p style={{marginTop:15,color: 'red'}}>
                                                注意：目前直接采用平台支付的方式正在进行安全评估以及跨平台测试，建议先采用个人钱包支付，等待安全性评估结束以及官方钱包等基础设施上线主网之后，我们会根据安全性评估的结果选择是否开放平台支付功能。
                                            </p>
                                            <p style={{marginTop:15}}>
                                                {this.state.ifSupportExtPay && <Button className="small-button" onClick={()=>{this.payByExt("PartB", "begin")}}>Chrome插件支付(已检测安装)</Button> }
                                                {!this.state.ifSupportExtPay && "未检测到可用的支付插件，无法采用平台支付"}
                                            </p>
                                        </TabPane>
                                        <TabPane tab="手动支付" key="2">
                                            <p className="doc-p">您可以选择使用 NEBULAS 官方提供的<a href={"https://github.com/nebulasio/web-wallet"} target={"_blank"}>钱包</a>通过调用智能合约的方式来完成本次协议的制定，合约调用成功即代表协议调用成功</p>
                                            <p>
                                                协议生成一共需要两次调用智能合约，两次智能合约的调用顺序有严格规定，并且应当在第一次调用智能合约（由乙方完成）成功之后再进行第二次合约调用。
                                            </p>
                                            <p>
                                                首先第一次由乙方完成智能合约的调用，操作方式如下：
                                            </p>

                                            <Timeline style={{marginTop: 40,marginBottom:0}}>
                                                <Timeline.Item><b>乙方</b>进入个人 Web 钱包，选择合约，点击执行标签</Timeline.Item>
                                                <Timeline.Item>点击选择钱包文件（如果没有钱包需要先新建钱包并保证有足够余额）</Timeline.Item>
                                                <Timeline.Item>
                                                    <p>填入参数：</p>
                                                    <p>函数：<b>{contractConfig[0].functionName}</b></p>
                                                    <p>参数：<b>{JSON.stringify([this.state.PartB.beginStep1.content.id,{
                                                        name:Base64.utf8ToBase64(this.state.PartB.beginStep1.content.name),
                                                        jiaAddress: this.state.PartB.beginStep1.content.jiaAddress,
                                                        yiAddress: this.state.PartB.beginStep1.content.yiAddress,
                                                        agreementContent: Base64.utf8ToBase64(this.state.PartB.beginStep1.content.agreementContent),
                                                        value: this.state.PartB.beginStep1.content.value,
                                                        ifSendYi: this.state.PartB.beginStep1.content.ifSendYi
                                                    }])}</b></p>
                                                    <p>目的地址：<b>{contractAddress}</b></p>
                                                    <p>要发送的金额：<b>0</b></p>
                                                </Timeline.Item>
                                                <Timeline.Item>分别执行解锁、测试、提交后，执行成功后即代表交易成功</Timeline.Item>
                                            </Timeline>

                                            <p>对智能合约的两次调用成功之后，即表明该合约已经签署完成，相关资产已经成功托管在 NEBULAS 星云链主之上。</p>
                                        </TabPane>
                                    </Tabs>

                                    <div className="input-group">
                                        <Button className="small-button"  onClick={()=>{this.beginChangeStep("PartB",0)}}>上一步</Button>
                                        <Button type="primary" className="small-button" onClick={()=>{this.success("PartB", "begin")}}>完成</Button>
                                    </div>
                                </div>
                                }
                            </TabPane>
                            <TabPane tab="响应签署（甲方）" key="2">
                                <Steps current={this.state.PartA.beginStepCurrent} style={{padding:"10px 20px 0"}}>
                                    <Step title="甲方查询自身关联的协议"/>
                                    <Step title="甲方确认协议内容并签署"/>
                                </Steps>

                                {this.state.PartA.beginStepCurrent === 0 &&
                                <div className="step-content-container">
                                    <p>请先从区块链网络查找您关联的协议：</p>
                                    <div className="input-group">
                                        <label>请输入您的 NAS 地址（和乙方签订协议的地址）:</label>
                                        <Input type="text" className="common-input" value={this.state.PartA.beginStep1.content.jiaAddress}
                                               onChange={(e) => {this.changeContent("PartA","beginStep1", "jiaAddress", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <Button type="primary" className="small-button" onClick={()=>{this.searchAgreementFromChain(this.state.PartA.beginStep1.content.jiaAddress, "PartA", "begin")}}>查询</Button>
                                    </div>

                                    <div className={ClassNames({"hide": !this.state.PartA.beginStep1.searched})}>
                                        <br/>
                                        <AgreementTable data={this.state.PartA.beginStep1.table}
                                                        onSelected={(value)=>{
                                                            this.onSelectedFromChain(value, "PartA", "begin")
                                                        }}
                                        />
                                        <div className="input-group">
                                            <Button type="primary" className="small-button" onClick={()=>{this.beginChangeStep("PartA",1)}}>下一步</Button>
                                        </div>
                                    </div>

                                </div>
                                }

                                {this.state.PartA.beginStepCurrent === 1 &&
                                <div className="step-content-container">
                                    <p><b>协议内容</b></p>
                                    <p>{this.state.PartA.beginStep1.content.agreementContent}</p>
                                    <p><b>协议履行完成后，款项会由合约地址直接{this.state.PartA.beginStep1.content.ifSendYi ? "转入乙方" : "转回甲方"}账户</b></p>
                                    <Tabs defaultActiveKey="2" size={'large'}>
                                        <TabPane tab="平台支付" key="1">
                                            <p style={{marginTop:15,color: 'red'}}>
                                                注意：目前直接采用平台支付的方式正在进行安全评估以及跨平台测试，暂时只支持Chrome插件支付，建议先采用个人钱包支付，等待安全性评估结束以及官方钱包等基础设施上线主网之后，我们会根据安全性评估的结果选择是否开放平台支付功能。
                                            </p>
                                            <p style={{marginTop:15}}>
                                                {this.state.ifSupportExtPay && <Button className="small-button" onClick={()=>{this.payByExt("PartA", "begin")}}>Chrome插件支付(已检测安装)</Button> }
                                                {!this.state.ifSupportExtPay && "未检测到可用的支付插件，无法采用平台支付"}
                                            </p>
                                        </TabPane>
                                        <TabPane tab="手动支付" key="2">

                                            <p>
                                                请确保协议内容无误并同意后，按照如下方式进行智能合约的调用，一旦发起调用则意味着您签署该协议。
                                            </p>

                                            <p className="doc-p">您可以选择使用 NEBULAS 官方提供的<a href={"https://github.com/nebulasio/web-wallet"} target={"_blank"}>钱包</a>通过调用智能合约的方式来完成本次协议的制定，合约调用成功即代表协议调用成功</p>

                                            <Timeline style={{marginTop: 40,marginBottom:0}}>
                                                <Timeline.Item><b>甲方</b>进入个人 Web 钱包，选择合约，点击执行标签</Timeline.Item>
                                                <Timeline.Item>点击选择钱包文件（如果没有钱包需要先新建钱包并保证有足够余额）</Timeline.Item>
                                                <Timeline.Item>
                                                    <p>填入参数：</p>
                                                    <p>函数：<b>{contractConfig[1].functionName}</b></p>
                                                    <p>参数：<b>{JSON.stringify([this.state.PartA.beginStep1.content.id])}</b></p>
                                                    <p>目的地址：<b>{contractAddress}</b></p>
                                                    <p>要发送的金额：<b>{Number(this.state.PartA.beginStep1.content.value) / Math.pow(10,19)}</b></p>
                                                </Timeline.Item>
                                                <Timeline.Item>分别执行解锁、测试、提交后，执行成功后即代表交易成功</Timeline.Item>
                                            </Timeline>

                                            <p>对智能合约的两次调用成功之后，即表明该合约已经签署完成，相关资产已经成功托管在 NEBULAS 星云链主之上。</p>
                                        </TabPane>
                                    </Tabs>

                                    <div className="input-group">
                                        <Button className="small-button"  onClick={()=>{this.beginChangeStep("PartA",0)}}>上一步</Button>
                                        <Button type="primary" className="small-button" onClick={()=>{this.success("PartA","begin")}}>完成</Button>
                                    </div>
                                </div>
                                }

                            </TabPane>
                        </Tabs>

                    </div>
                    }

                    {this.state.endAgreement && // 完成协议部分
                    <div className="step-container">
                        <Tabs defaultActiveKey="1" size={'large'}>
                            <TabPane tab="发起完成（乙方）" key="1">
                                <Steps current={this.state.PartB.endStepCurrent} style={{padding:"10px 20px 0"}}>
                                    <Step title="乙方查询自身已经签署的协议"/>
                                    <Step title="乙方发出协议执行结束的要约"/>
                                </Steps>

                                {this.state.PartB.endStepCurrent === 0 &&
                                <div className="step-content-container">
                                    <p>完成协议时，同样需要先由乙方发出完成协议要约。</p>
                                    <div className="input-group">
                                        <label>请输入您签订合约的 NAS 地址（乙方）:</label>
                                        <Input type="text" className="common-input" value={this.state.PartB.endStep1.content.yiAddress}
                                               onChange={(e) => {this.changeContent("PartB","endStep1", "yiAddress", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <Button type="primary" className="small-button" onClick={()=>{this.searchAgreementFromChain(this.state.PartB.endStep1.content.yiAddress,"PartB", "end")}}>查询</Button>
                                    </div>
                                    <div className={ClassNames({"hide": !this.state.PartB.endStep1.searched})}>
                                        <br/>
                                        <AgreementTable data={this.state.PartB.endStep1.table}
                                                        onSelected={(value)=>{
                                                            this.onSelectedFromChain(value, "PartB", "end")
                                                        }}
                                        />
                                        <div className="input-group">
                                            <Button type="primary" className="small-button" onClick={()=>{this.endChangeStep("PartB",1)}}>下一步</Button>
                                        </div>
                                    </div>
                                </div>
                                }

                                {this.state.PartB.endStepCurrent === 1 &&
                                <div className="step-content-container">
                                    <p><b>协议内容</b></p>
                                    <p>{this.state.PartB.beginStep1.content.agreementContent}</p>
                                    <p>
                                        <b>协议履行完成后，款项会由合约地址直接{this.state.PartB.beginStep1.content.ifSendYi ? "转入乙方" : "转回甲方"}账户</b>
                                    </p>
                                    <Tabs defaultActiveKey="2" size={'large'}>
                                        <TabPane tab="平台支付" key="1">
                                            <p style={{marginTop: 15, color: 'red'}}>
                                                注意：目前直接采用平台支付的方式正在进行安全评估以及跨平台测试，建议先采用个人钱包支付，等待安全性评估结束以及官方钱包等基础设施上线主网之后，我们会根据安全性评估的结果选择是否开放平台支付功能。
                                            </p>
                                            <p style={{marginTop:15}}>
                                                {this.state.ifSupportExtPay && <Button className="small-button" onClick={()=>{this.payByExt("PartB", "end")}}>Chrome插件支付(已检测安装)</Button> }
                                                {!this.state.ifSupportExtPay && "未检测到可用的支付插件，无法采用平台支付"}
                                            </p>
                                        </TabPane>
                                        <TabPane tab="手动支付" key="2">
                                            <p className="doc-p">您可以选择使用 NEBULAS 官方提供的<a
                                                href={"https://github.com/nebulasio/web-wallet"}
                                                target={"_blank"}>钱包</a>通过调用智能合约的方式来完成本次协议的完成操作，合约调用成功即代表完成协议的操作签署成功</p>
                                            <p>
                                                您可以按照如下方式进行完成协议的操作，一旦您签署完成协议，甲方即可以按照之前的约定将资产直接划转至您的签署账户或者转会自身地址。
                                            </p>
                                            请协议期结束后提醒乙方发出完成要约
                                            <Timeline style={{marginTop: 40, marginBottom: 0}}>
                                                <Timeline.Item><b>乙方</b>进入个人 Web 钱包，选择合约，点击执行标签</Timeline.Item>
                                                <Timeline.Item>点击选择钱包文件（如果没有钱包需要先新建钱包并保证有足够余额）</Timeline.Item>
                                                <Timeline.Item>
                                                    <p>填入参数：</p>
                                                    <p>函数：<b>{contractConfig[0].functionName}</b></p>
                                                    <p>参数：<b>{JSON.stringify([this.state.PartB.endStep1.content.id])}</b></p>
                                                    <p>目的地址：<b>{contractAddress}</b></p>
                                                    <p>要发送的金额：<b>0</b></p>
                                                </Timeline.Item>
                                                <Timeline.Item>分别执行解锁、测试、提交后，执行成功后即代表交易成功</Timeline.Item>
                                            </Timeline>

                                        </TabPane>
                                    </Tabs>

                                    <div className="input-group">
                                        <Button className="small-button" onClick={() => {
                                            this.endChangeStep("PartB", 0)
                                        }}>上一步</Button>
                                        <Button type="primary" className="small-button" onClick={() => {
                                            this.success("PartB", "end")
                                        }}>完成</Button>
                                    </div>
                                </div>
                                }
                            </TabPane>
                            <TabPane tab="响应完成（甲方）" key="2">
                                <Steps current={this.state.PartA.endStepCurrent} style={{padding:"10px 20px 0"}}>
                                    <Step title="甲方查询自身已经签署的协议"/>
                                    <Step title="甲方履行要约，取回资产或者转入乙方账户"/>
                                </Steps>

                                {this.state.PartA.endStepCurrent === 0 &&
                                <div className="step-content-container">
                                    <p>请先从区块链网络查找您关联的协议：</p>
                                    <div className="input-group">
                                        <label>请输入您的 NAS 地址（和乙方签订协议的地址）:</label>
                                        <Input type="text" className="common-input" value={this.state.PartA.endStep1.content.jiaAddress}
                                               onChange={(e) => {this.changeContent("PartA","endStep1", "jiaAddress", e.target.value)}}/>
                                    </div>
                                    <div className="input-group">
                                        <Button type="primary" className="small-button" onClick={()=>{this.searchAgreementFromChain(this.state.PartA.endStep1.content.jiaAddress, "PartA", "end")}}>查询</Button>
                                    </div>

                                    <div className={ClassNames({"hide": !this.state.PartA.endStep1.searched})}>
                                        <br/>
                                        <AgreementTable data={this.state.PartA.endStep1.table}
                                                        onSelected={(value)=>{
                                                            this.onSelectedFromChain(value, "PartA", "end")
                                                        }}
                                        />
                                        <div className="input-group">
                                            <Button type="primary" className="small-button" onClick={()=>{this.endChangeStep("PartA",1)}}>下一步</Button>
                                        </div>
                                    </div>

                                </div>
                                }

                                {this.state.PartA.endStepCurrent === 1 &&
                                <div className="step-content-container">
                                    <p><b>协议内容</b></p>
                                    <p>{this.state.PartA.endStep1.content.agreementContent}</p>
                                    <p><b>协议履行完成后，款项会由合约地址直接{this.state.PartA.endStep1.content.ifSendYi ? "转入乙方" : "转回甲方"}账户</b></p>
                                    <Tabs defaultActiveKey="2" size={'large'}>
                                        <TabPane tab="平台支付" key="1">
                                            <p style={{marginTop:15,color: 'red'}}>
                                                注意：目前直接采用平台支付的方式正在进行安全评估以及跨平台测试，建议先采用个人钱包支付，等待安全性评估结束以及官方钱包等基础设施上线主网之后，我们会根据安全性评估的结果选择是否开放更多平台支付功能。
                                            </p>
                                            <p style={{marginTop:15}}>
                                                {this.state.ifSupportExtPay && <Button className="small-button" onClick={()=>{this.payByExt("PartA", "end")}}>Chrome插件支付(已检测安装)</Button> }
                                                {!this.state.ifSupportExtPay && "未检测到可用的支付插件，无法采用平台支付"}
                                            </p>
                                        </TabPane>
                                        <TabPane tab="手动支付" key="2">
                                            <p>
                                                请确保协议内容无误并同意后，按照如下方式进行智能合约的调用，一旦发起调用则意味着您签署该协议。
                                            </p>

                                            <p className="doc-p">您可以选择使用 NEBULAS 官方提供的<a href={"https://github.com/nebulasio/web-wallet"} target={"_blank"}>钱包</a>通过调用智能合约的方式来完成本次协议的制定，合约调用成功即代表协议调用成功</p>

                                            <Timeline style={{marginTop: 40,marginBottom:0}}>
                                                <Timeline.Item><b>甲方</b>进入个人 Web 钱包，选择合约，点击执行标签</Timeline.Item>
                                                <Timeline.Item>点击选择钱包文件（如果没有钱包需要先新建钱包并保证有足够余额）</Timeline.Item>
                                                <Timeline.Item>
                                                    <p>填入参数：</p>
                                                    <p>函数：<b>{contractConfig[1].functionName}</b></p>
                                                    <p>参数：<b>{JSON.stringify([this.state.PartA.endStep1.content.id])}</b></p>
                                                    <p>目的地址：<b>{contractAddress}</b></p>
                                                    <p>要发送的金额：<b>0</b></p>
                                                </Timeline.Item>
                                                <Timeline.Item>分别执行解锁、测试、提交后，执行成功后即代表交易成功</Timeline.Item>
                                            </Timeline>

                                            <p>对智能合约的两次调用成功之后，即表明该合约已经签署完成，相关资产已经成功托管在 NEBULAS 星云链主之上。</p>
                                        </TabPane>
                                    </Tabs>

                                    <div className="input-group">
                                        <Button className="small-button"  onClick={()=>{this.endChangeStep("PartA",0)}}>上一步</Button>
                                        <Button type="primary" className="small-button" onClick={()=>{this.success("PartA","end")}}>完成</Button>
                                    </div>
                                </div>
                                }

                            </TabPane>
                        </Tabs>
                    </div>
                    }

                </div>
            </div>
        );
    }
}

export default Main;
