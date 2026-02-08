import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
export interface StatelessMcpStackProps extends cdk.StackProps {
    stage: string;
    managementApiKey: string;
    /** When true, the /mcp route uses the token authorizer Lambda; when false, no auth (NONE). */
    authorizationEnabled: boolean;
}
export declare class StatelessMcpStack extends cdk.Stack {
    readonly mcpEndpoint: string;
    constructor(scope: Construct, id: string, props: StatelessMcpStackProps);
}
