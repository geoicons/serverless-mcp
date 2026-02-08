import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
export interface StatelessMcpStackProps extends cdk.StackProps {
    stage: string;
}
export declare class StatelessMcpStack extends cdk.Stack {
    readonly mcpEndpoint: string;
    constructor(scope: Construct, id: string, props: StatelessMcpStackProps);
}
