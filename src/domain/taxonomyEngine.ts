/**
 * Taxonomy Engine
 * Standardized occupational mapping for software engineering and data science capabilities.
 * Maps detected developer skills and capabilities to official O*NET-SOC and ESCO taxonomies.
 *
 * Provides authoritative classification requested by enterprise hiring systems (e.g. CV Heap).
 */

export interface TaxonomyMatch {
  skill: string;
  normalizedSkill: string;
  onetCode: string; // e.g. '15-1252.00' (Software Developers)
  onetTitle: string;
  escoUri: string;
  escoCategory: 'knowledge' | 'skill_competence';
  socGroup: string;
  broadIndustry: string;
  standardKeywords: string[];
}

export interface TaxonomyProfile {
  primaryOnetCode: string;
  primaryOnetTitle: string;
  socGroupDistribution: Record<string, number>;
  mappedSkillsCount: number;
  unmappedSkills: string[];
  skills: TaxonomyMatch[];
}

// Canonical O*NET & ESCO Reference Database for Developer Capabilities
const TAXONOMY_REGISTRY: Record<string, Omit<TaxonomyMatch, 'skill' | 'normalizedSkill'>> = {
  // Languages & Core Engineering -> 15-1252.00 Software Developers
  typescript: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/33d59648-5246-4cb4-b5a8-5ea91ca3d387',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Software & Technology Services',
    standardKeywords: ['typescript', 'ts', 'typed-javascript', 'ecmascript'],
  },
  javascript: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/33d59648-5246-4cb4-b5a8-5ea91ca3d387',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Software & Technology Services',
    standardKeywords: ['javascript', 'js', 'es6', 'esnext'],
  },
  python: {
    onetCode: '15-1251.00',
    onetTitle: 'Computer Programmers',
    escoUri: 'http://data.europa.eu/esco/skill/4cd7612f-6be1-4966-bf5b-2ee0f55cf73a',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Software & Technology Services',
    standardKeywords: ['python', 'py', 'python3', 'cpython'],
  },
  rust: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/96b86657-36ff-4537-8e68-07011d08e085',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Systems Engineering',
    standardKeywords: ['rust', 'cargo', 'crates', 'systems-programming'],
  },
  go: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/96b86657-36ff-4537-8e68-07011d08e085',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Systems & Backend Services',
    standardKeywords: ['go', 'golang', 'goroutines'],
  },
  java: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/9a385f09-e15a-4bbf-b94f-f9543e5c92c5',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Enterprise Applications',
    standardKeywords: ['java', 'jvm', 'spring', 'maven'],
  },

  // Frontend & Mobile Frameworks -> 15-1254.00 Web Developers / 15-1252.00
  react: {
    onetCode: '15-1254.00',
    onetTitle: 'Web Developers',
    escoUri: 'http://data.europa.eu/esco/skill/30db9f18-6bb9-4d22-9457-307a00f28e20',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'User Interface Engineering',
    standardKeywords: ['react', 'reactjs', 'react-dom', 'jsx'],
  },
  'react-native': {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/561d3615-ef6c-48be-a6ad-09ea3be62ea9',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Mobile Application Development',
    standardKeywords: ['react-native', 'expo', 'mobile-development', 'ios-android'],
  },
  nextjs: {
    onetCode: '15-1254.00',
    onetTitle: 'Web Developers',
    escoUri: 'http://data.europa.eu/esco/skill/30db9f18-6bb9-4d22-9457-307a00f28e20',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Full-Stack Web Engineering',
    standardKeywords: ['next.js', 'nextjs', 'ssr', 'server-components'],
  },
  vue: {
    onetCode: '15-1254.00',
    onetTitle: 'Web Developers',
    escoUri: 'http://data.europa.eu/esco/skill/30db9f18-6bb9-4d22-9457-307a00f28e20',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Web User Interfaces',
    standardKeywords: ['vue', 'vuejs', 'nuxt'],
  },

  // Backend & APIs -> 15-1252.00 Software Developers
  fastapi: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/5195e28a-784f-4d3e-90aa-f17b9b18d2d1',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'API & Microservice Engineering',
    standardKeywords: ['fastapi', 'pydantic', 'openapi', 'uvicorn'],
  },
  express: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/5195e28a-784f-4d3e-90aa-f17b9b18d2d1',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Node.js Backend Architecture',
    standardKeywords: ['express', 'expressjs', 'middleware', 'rest-api'],
  },
  graphql: {
    onetCode: '15-1252.00',
    onetTitle: 'Software Developers',
    escoUri: 'http://data.europa.eu/esco/skill/5195e28a-784f-4d3e-90aa-f17b9b18d2d1',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'API Protocols & Schemas',
    standardKeywords: ['graphql', 'apollo', 'queries-mutations'],
  },

  // Machine Learning & AI -> 15-2051.00 Data Scientists / 15-1221.00 Computer and Information Research Scientists
  'machine-learning': {
    onetCode: '15-2051.00',
    onetTitle: 'Data Scientists',
    escoUri: 'http://data.europa.eu/esco/skill/2a2e4d29-c854-46c5-926c-94fb59f77626',
    escoCategory: 'knowledge',
    socGroup: 'Mathematical and Computational Sciences',
    broadIndustry: 'Artificial Intelligence & Machine Learning',
    standardKeywords: ['machine-learning', 'ml', 'scikit-learn', 'deep-learning'],
  },
  pytorch: {
    onetCode: '15-2051.00',
    onetTitle: 'Data Scientists',
    escoUri: 'http://data.europa.eu/esco/skill/2a2e4d29-c854-46c5-926c-94fb59f77626',
    escoCategory: 'skill_competence',
    socGroup: 'Mathematical and Computational Sciences',
    broadIndustry: 'Deep Learning & Neural Networks',
    standardKeywords: ['pytorch', 'torch', 'tensors', 'autograd'],
  },
  tensorflow: {
    onetCode: '15-2051.00',
    onetTitle: 'Data Scientists',
    escoUri: 'http://data.europa.eu/esco/skill/2a2e4d29-c854-46c5-926c-94fb59f77626',
    escoCategory: 'skill_competence',
    socGroup: 'Mathematical and Computational Sciences',
    broadIndustry: 'Deep Learning Systems',
    standardKeywords: ['tensorflow', 'tf', 'keras'],
  },
  llm: {
    onetCode: '15-1221.00',
    onetTitle: 'Computer and Information Research Scientists',
    escoUri: 'http://data.europa.eu/esco/skill/7cf55255-08e5-4d24-817a-5ca07c4bc3bb',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Generative AI & Natural Language Processing',
    standardKeywords: ['llm', 'transformers', 'embeddings', 'nlp', 'mcp'],
  },

  // Cloud & DevOps -> 15-1244.00 Network and Computer Systems Administrators / 15-1241.00 Computer Network Architects
  docker: {
    onetCode: '15-1241.00',
    onetTitle: 'Computer Network Architects',
    escoUri: 'http://data.europa.eu/esco/skill/0f9ef46a-73d8-4f27-be28-a401c183cf13',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'DevOps & Containerization',
    standardKeywords: ['docker', 'container', 'dockerfile', 'compose'],
  },
  kubernetes: {
    onetCode: '15-1241.00',
    onetTitle: 'Computer Network Architects',
    escoUri: 'http://data.europa.eu/esco/skill/0f9ef46a-73d8-4f27-be28-a401c183cf13',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Cloud Orchestration & Infrastructure',
    standardKeywords: ['kubernetes', 'k8s', 'helm', 'kubectl'],
  },
  aws: {
    onetCode: '15-1241.00',
    onetTitle: 'Computer Network Architects',
    escoUri: 'http://data.europa.eu/esco/skill/5b7f14ad-81bc-4e64-9b2f-2c35bb53f938',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Cloud Computing Services',
    standardKeywords: ['aws', 'amazon-web-services', 's3', 'lambda', 'ec2'],
  },
  terraform: {
    onetCode: '15-1241.00',
    onetTitle: 'Computer Network Architects',
    escoUri: 'http://data.europa.eu/esco/skill/0f9ef46a-73d8-4f27-be28-a401c183cf13',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Infrastructure as Code',
    standardKeywords: ['terraform', 'iac', 'hcl'],
  },

  // Databases -> 15-1242.00 Database Administrators and Architects
  postgresql: {
    onetCode: '15-1242.00',
    onetTitle: 'Database Administrators and Architects',
    escoUri: 'http://data.europa.eu/esco/skill/c4e85dc6-6b2a-43d9-95cb-bd0f40d18bc3',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Relational Database Management Systems',
    standardKeywords: ['postgres', 'postgresql', 'sql', 'psql'],
  },
  mongodb: {
    onetCode: '15-1242.00',
    onetTitle: 'Database Administrators and Architects',
    escoUri: 'http://data.europa.eu/esco/skill/c4e85dc6-6b2a-43d9-95cb-bd0f40d18bc3',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Document & NoSQL Databases',
    standardKeywords: ['mongodb', 'nosql', 'mongoose'],
  },
  redis: {
    onetCode: '15-1242.00',
    onetTitle: 'Database Administrators and Architects',
    escoUri: 'http://data.europa.eu/esco/skill/c4e85dc6-6b2a-43d9-95cb-bd0f40d18bc3',
    escoCategory: 'knowledge',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'In-Memory Caching & Key-Value Stores',
    standardKeywords: ['redis', 'caching', 'pubsub'],
  },

  // Security -> 15-1212.00 Information Security Analysts
  security: {
    onetCode: '15-1212.00',
    onetTitle: 'Information Security Analysts',
    escoUri: 'http://data.europa.eu/esco/skill/12c11e64-f6ef-4680-bc9b-325db117088b',
    escoCategory: 'skill_competence',
    socGroup: 'Computer and Information Technology',
    broadIndustry: 'Cybersecurity & Application Security',
    standardKeywords: ['security', 'cryptography', 'sha-256', 'auth', 'oauth', 'jwt'],
  },
};

export class TaxonomyEngine {
  /**
   * Normalizes a raw skill string for taxonomy lookup.
   */
  public static normalizeSkillName(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/[\(\)\[\]\{\}\.,\/#!$%\^&\*;:{}=\-_`~?]/g, ' ')
      .trim()
      .replace(/\s+/g, '-');
  }

  /**
   * Maps a single skill string to an official O*NET-SOC and ESCO taxonomy entry.
   * Handles direct aliases, sub-strings, and standard tech keywords.
   */
  public static mapSkillToTaxonomy(rawSkill: string): TaxonomyMatch | null {
    const normalized = this.normalizeSkillName(rawSkill);
    if (!normalized) return null;

    // 1. Exact match in registry keys
    if (TAXONOMY_REGISTRY[normalized]) {
      const match = TAXONOMY_REGISTRY[normalized];
      return {
        skill: rawSkill,
        normalizedSkill: normalized,
        ...match,
      };
    }

    // 2. Exact keyword alias lookup
    for (const [key, entry] of Object.entries(TAXONOMY_REGISTRY)) {
      const isExactKeyword = entry.standardKeywords.some((kw) => {
        return normalized === this.normalizeSkillName(kw);
      });
      if (isExactKeyword) {
        return {
          skill: rawSkill,
          normalizedSkill: key,
          ...entry,
        };
      }
    }

    // 2b. Token and compound alias lookup (e.g. "react-js" matches "react", but "js" doesn't claim "react")
    const tokens = normalized.split('-');
    for (const [key, entry] of Object.entries(TAXONOMY_REGISTRY)) {
      const isTokenMatch = entry.standardKeywords.some((kw) => {
        const normKw = this.normalizeSkillName(kw);
        if (normKw.length <= 2) {
          return tokens.length === 1 && tokens[0] === normKw;
        }
        return (
          tokens.includes(normKw) ||
          normalized.startsWith(normKw + '-') ||
          normalized.endsWith('-' + normKw)
        );
      });

      if (isTokenMatch) {
        return {
          skill: rawSkill,
          normalizedSkill: key,
          ...entry,
        };
      }
    }

    // 3. Heuristic classification based on software suffixes
    if (
      normalized.includes('api') ||
      normalized.includes('backend') ||
      normalized.includes('server')
    ) {
      return {
        skill: rawSkill,
        normalizedSkill: 'software-engineering',
        onetCode: '15-1252.00',
        onetTitle: 'Software Developers',
        escoUri: 'http://data.europa.eu/esco/skill/33d59648-5246-4cb4-b5a8-5ea91ca3d387',
        escoCategory: 'skill_competence',
        socGroup: 'Computer and Information Technology',
        broadIndustry: 'Software & Technology Services',
        standardKeywords: [normalized],
      };
    }

    if (
      normalized.includes('ai') ||
      normalized.includes('model') ||
      normalized.includes('data')
    ) {
      return {
        skill: rawSkill,
        normalizedSkill: 'data-science',
        onetCode: '15-2051.00',
        onetTitle: 'Data Scientists',
        escoUri: 'http://data.europa.eu/esco/skill/2a2e4d29-c854-46c5-926c-94fb59f77626',
        escoCategory: 'knowledge',
        socGroup: 'Mathematical and Computational Sciences',
        broadIndustry: 'Artificial Intelligence & Machine Learning',
        standardKeywords: [normalized],
      };
    }

    return null;
  }

  /**
   * Generates a complete occupational taxonomy profile for a list of candidate skills.
   */
  public static buildTaxonomyProfile(skills: string[]): TaxonomyProfile {
    const mappedSkills: TaxonomyMatch[] = [];
    const unmappedSkills: string[] = [];
    const onetCounts: Record<string, { count: number; title: string }> = {};
    const socGroupDistribution: Record<string, number> = {};

    for (const s of skills) {
      const match = this.mapSkillToTaxonomy(s);
      if (match) {
        mappedSkills.push(match);

        // Track O*NET frequency
        if (!onetCounts[match.onetCode]) {
          onetCounts[match.onetCode] = { count: 0, title: match.onetTitle };
        }
        onetCounts[match.onetCode].count++;

        // Track SOC group distribution
        socGroupDistribution[match.socGroup] =
          (socGroupDistribution[match.socGroup] || 0) + 1;
      } else {
        unmappedSkills.push(s);
      }
    }

    // Determine primary occupational code (highest frequency)
    let primaryOnetCode = '15-1252.00';
    let primaryOnetTitle = 'Software Developers';
    let maxCount = 0;

    for (const [code, info] of Object.entries(onetCounts)) {
      if (info.count > maxCount) {
        maxCount = info.count;
        primaryOnetCode = code;
        primaryOnetTitle = info.title;
      }
    }

    return {
      primaryOnetCode,
      primaryOnetTitle,
      socGroupDistribution,
      mappedSkillsCount: mappedSkills.length,
      unmappedSkills,
      skills: mappedSkills,
    };
  }
}
