/**
 * Tests for Evident ProofGraph
 */

import { ProofGraph } from '../domain/proofGraph';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';
import { ProjectSource, EvidenceItem } from '../domain/types';

describe('ProofGraph', () => {
  let graph: ProofGraph;

  beforeEach(() => {
    graph = new ProofGraph(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);
  });

  it('initializes with candidate golden projects and evidence', () => {
    expect(graph.getProjects().length).toBe(3);
    expect(graph.getEvidence().length).toBe(GOLDEN_EVIDENCE.length);
  });

  it('correctly retrieves evidence items for a specific project', () => {
    const riftEvidence = graph.getEvidenceForProject('proj_rift');
    expect(riftEvidence.length).toBeGreaterThan(0);
    expect(riftEvidence.every((e) => e.projectId === 'proj_rift')).toBe(true);
  });

  it('filters evidence by skill query', () => {
    const jwtEvidence = graph.getEvidenceForSkill('jwt');
    expect(jwtEvidence.length).toBeGreaterThan(0);
    expect(jwtEvidence[0].skillName).toContain('JWT');
  });

  it('extracts distinct skills with accurate frequency counts', () => {
    const skills = graph.getDistinctSkills();
    expect(skills.length).toBeGreaterThan(0);
    const reactSkill = skills.find((s) => s.name.toLowerCase().includes('react'));
    expect(reactSkill).toBeDefined();
    expect(reactSkill!.count).toBeGreaterThanOrEqual(1);
  });

  it('generates a connected visual graph structure with nodes and edges', () => {
    const visual = graph.generateVisualGraph();
    expect(visual.nodes.length).toBeGreaterThan(0);
    expect(visual.edges.length).toBeGreaterThan(0);

    // Verify project nodes exist
    const projectNodes = visual.nodes.filter((n) => n.type === 'project');
    expect(projectNodes.length).toBe(3);

    // Verify skill nodes exist
    const skillNodes = visual.nodes.filter((n) => n.type === 'skill');
    expect(skillNodes.length).toBeGreaterThan(0);

    // Verify file nodes exist
    const fileNodes = visual.nodes.filter((n) => n.type === 'file');
    expect(fileNodes.length).toBeGreaterThan(0);
  });

  it('supports dynamically adding a new project and updating relationships', () => {
    const newProj: ProjectSource = {
      id: 'proj_custom',
      name: 'CUSTOM_GATEWAY',
      description: 'Custom proxy layer',
      primaryLanguage: 'Go',
      languages: ['Go'],
      frameworks: ['Gin'],
      totalCommits: 12,
      candidateCommits: 12,
      isForkOrTemplate: false,
      lastUpdated: '2026-09-25',
      files: ['main.go'],
      evidenceIds: [],
    };

    graph.addProject(newProj);
    expect(graph.getProjects().length).toBe(4);
    expect(graph.getProjects().some((p) => p.id === 'proj_custom')).toBe(true);
  });

  it('prevents duplicate edges when generating the visual graph', () => {
    const visual = graph.generateVisualGraph();
    const edgeIds = visual.edges.map((e) => e.id);
    const uniqueEdgeIds = new Set(edgeIds);
    expect(edgeIds.length).toBe(uniqueEdgeIds.size);
  });
});
