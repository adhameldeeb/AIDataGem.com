
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SystemDiagram from './SystemDiagram';

export const SYSTEM_DIAGRAMS = {
  architecture: `
graph TB
  subgraph Client["Client Layer"]
    UI[User Interface]
    STATE[State Management]
    VIZ[Visualizations]
  end
  
  subgraph API["API Layer"]
    ROUTES[API Routes]
    MIDDLEWARE[Middleware]
    AUTH[Auth Handler]
  end
  
  subgraph Edge["Edge Functions"]
    PROXY[LLM API Proxy]
    EMBED[Embedding Generation]
    ANALYZE[Analysis Pipeline]
    EXTRACT[Data Extraction]
  end
  
  subgraph DB["Database Layer"]
    VECTOR[Vector Database]
    SQL[SQL Database]
    STORAGE[File Storage]
  end
  
  UI --> STATE
  STATE --> ROUTES
  VIZ --> STATE
  
  ROUTES --> MIDDLEWARE
  MIDDLEWARE --> AUTH
  AUTH --> PROXY
  AUTH --> EMBED
  AUTH --> ANALYZE
  AUTH --> EXTRACT
  
  PROXY --> VECTOR
  EMBED --> VECTOR
  ANALYZE --> VECTOR
  ANALYZE --> SQL
  EXTRACT --> SQL
  EXTRACT --> STORAGE
  
  classDef primary fill:#4f46e5,stroke:#4338ca,color:white;
  classDef secondary fill:#f3f4f6,stroke:#d1d5db,color:#4b5563;
  classDef tertiary fill:#dbeafe,stroke:#93c5fd,color:#2563eb;
  
  class UI,STATE,VIZ primary;
  class ROUTES,MIDDLEWARE,AUTH secondary;
  class PROXY,EMBED,ANALYZE,EXTRACT tertiary;
  class VECTOR,SQL,STORAGE secondary;
  `,
  
  dataFlow: `
flowchart TD
  subgraph Inputs["Input Sources"]
    API[API Integration]
    UPLOAD[File Upload]
    DIRECT[Direct Input]
  end
  
  subgraph Processing["Processing Pipeline"]
    EXTRACT[Data Extraction]
    CLEAN[Data Cleaning]
    EMBED[Embedding Generation]
    ANALYZE[Data Analysis]
    ENRICH[Metadata Enrichment]
  end
  
  subgraph Storage["Storage Layer"]
    VECTOR[(Vector Database)]
    SQL[(SQL Database)]
    FILES[(File Storage)]
  end
  
  subgraph Analytics["Analytics Engine"]
    SEARCH[Semantic Search]
    INSIGHT[Insight Generation]
    VIZ[Visualization]
    REPORT[Report Generation]
  end
  
  API --> EXTRACT
  UPLOAD --> EXTRACT
  DIRECT --> EXTRACT
  
  EXTRACT --> CLEAN
  CLEAN --> EMBED
  EMBED --> VECTOR
  CLEAN --> ANALYZE
  ANALYZE --> ENRICH
  ANALYZE --> SQL
  ENRICH --> SQL
  UPLOAD --> FILES
  
  VECTOR --> SEARCH
  SQL --> INSIGHT
  VECTOR --> INSIGHT
  SEARCH --> VIZ
  INSIGHT --> VIZ
  SEARCH --> REPORT
  INSIGHT --> REPORT
  
  classDef primary fill:#4f46e5,stroke:#4338ca,color:white;
  classDef secondary fill:#f3f4f6,stroke:#d1d5db,color:#4b5563;
  classDef success fill:#10b981,stroke:#059669,color:white;
  classDef info fill:#dbeafe,stroke:#93c5fd,color:#2563eb;
  
  class API,UPLOAD,DIRECT secondary;
  class EXTRACT,CLEAN,EMBED,ANALYZE,ENRICH primary;
  class VECTOR,SQL,FILES secondary;
  class SEARCH,INSIGHT,VIZ,REPORT info;
  `,
  
  businessModel: `
flowchart TD
  subgraph Users["User Segments"]
    CASUAL[Casual Users]
    POWER[Power Users]
    ORG[Organizations]
    DEV[Developers]
  end
  
  subgraph Tiers["Subscription Tiers"]
    FREE[Free Tier]
    BASIC[Basic - $9/mo]
    PRO[Pro - $19/mo]
    TEAM[Team - $49/mo]
    ENT[Enterprise - Custom]
  end
  
  subgraph Features["Feature Set"]
    STORE[Data Storage]
    ANALYZE[Data Analysis]
    INSIGHT[AI Insights]
    API[API Access]
    COLLAB[Collaboration]
    CUSTOM[Custom Features]
  end
  
  CASUAL --> FREE
  CASUAL --> BASIC
  POWER --> BASIC
  POWER --> PRO
  ORG --> TEAM
  ORG --> ENT
  DEV --> PRO
  DEV --> TEAM
  
  FREE --> STORE
  BASIC --> STORE
  BASIC --> ANALYZE
  PRO --> STORE
  PRO --> ANALYZE
  PRO --> INSIGHT
  PRO --> API
  TEAM --> STORE
  TEAM --> ANALYZE
  TEAM --> INSIGHT
  TEAM --> API
  TEAM --> COLLAB
  ENT --> STORE
  ENT --> ANALYZE
  ENT --> INSIGHT
  ENT --> API
  ENT --> COLLAB
  ENT --> CUSTOM
  
  classDef primary fill:#4f46e5,stroke:#4338ca,color:white;
  classDef secondary fill:#f3f4f6,stroke:#d1d5db,color:#4b5563;
  classDef success fill:#10b981,stroke:#059669,color:white;
  classDef info fill:#dbeafe,stroke:#93c5fd,color:#2563eb;
  
  class CASUAL,POWER,ORG,DEV secondary;
  class FREE,BASIC,PRO,TEAM,ENT primary;
  class STORE,ANALYZE,INSIGHT,API,COLLAB,CUSTOM info;
  `,
  
  userJourney: `
graph LR
  subgraph Acquisition
    DISCOVER[Discover]
    LEARN[Learn]
    SIGNUP[Sign Up]
  end

  subgraph Activation
    CONNECT[Connect Data]
    UPLOAD[Upload History]
    SETUP[Setup Integrations]
  end

  subgraph Retention
    ANALYZE[Analyze Data]
    INSIGHT[Get Insights]
    SHARE[Share Results]
  end

  subgraph Revenue
    UPGRADE[Upgrade Plan]
    REFER[Refer Others]
    EXPAND[Expand Usage]
  end

  DISCOVER --> LEARN
  LEARN --> SIGNUP
  SIGNUP --> CONNECT
  CONNECT --> UPLOAD
  CONNECT --> SETUP
  UPLOAD --> ANALYZE
  SETUP --> ANALYZE
  ANALYZE --> INSIGHT
  INSIGHT --> SHARE
  SHARE --> UPGRADE
  ANALYZE --> UPGRADE
  INSIGHT --> UPGRADE
  UPGRADE --> REFER
  UPGRADE --> EXPAND

  classDef acquisition fill:#dbeafe,stroke:#93c5fd,color:#2563eb;
  classDef activation fill:#e0e7ff,stroke:#a5b4fc,color:#4f46e5;
  classDef retention fill:#dcfce7,stroke:#86efac,color:#16a34a;
  classDef revenue fill:#fef9c3,stroke:#fde047,color:#ca8a04;

  class DISCOVER,LEARN,SIGNUP acquisition;
  class CONNECT,UPLOAD,SETUP activation;
  class ANALYZE,INSIGHT,SHARE retention;
  class UPGRADE,REFER,EXPAND revenue;
  `
};

const SystemDiagrams = () => {
  return (
    <Tabs defaultValue="architecture" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="architecture">Architecture</TabsTrigger>
        <TabsTrigger value="dataFlow">Data Flow</TabsTrigger>
        <TabsTrigger value="businessModel">Business Model</TabsTrigger>
        <TabsTrigger value="userJourney">User Journey</TabsTrigger>
      </TabsList>
      
      <TabsContent value="architecture">
        <Card>
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemDiagram chart={SYSTEM_DIAGRAMS.architecture} className="h-[500px]" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="dataFlow">
        <Card>
          <CardHeader>
            <CardTitle>Data Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemDiagram chart={SYSTEM_DIAGRAMS.dataFlow} className="h-[500px]" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="businessModel">
        <Card>
          <CardHeader>
            <CardTitle>Business Model</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemDiagram chart={SYSTEM_DIAGRAMS.businessModel} className="h-[500px]" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="userJourney">
        <Card>
          <CardHeader>
            <CardTitle>User Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemDiagram chart={SYSTEM_DIAGRAMS.userJourney} className="h-[500px]" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SystemDiagrams;
