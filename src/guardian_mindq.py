#!/usr/bin/env python3
"""
Mind-Q Guardian Adapter
=======================

A specialized Guardian adapter for the Mind-Q V4.1 logistics data pipeline.
Provides phase-aware context generation and pipeline-specific monitoring.

Features:
- Automatic phase detection and spine generation
- Phase card generation for each pipeline stage
- Reduced context strings optimized for LLM agents
- KPI and business impact tracking per phase
"""

import os
import re
import json
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime


class MindQGuardianAdapter:
    """
    Mind-Q specific Guardian adapter for phase-aware project analysis.
    
    This adapter understands the Mind-Q pipeline structure and can generate
    optimized context for AI agents working on logistics data pipelines.
    """
    
    def __init__(self, mindq_repo_path: str):
        """
        Initialize the Mind-Q Guardian adapter.
        
        Args:
            mindq_repo_path: Path to the Mind-Q repository root
        """
        self.repo_path = Path(mindq_repo_path).resolve()
        self.phases_path = self.repo_path / "phases"
        self.docs_path = self.repo_path / "docs"
        self.guide_path = self.docs_path / "PHASES_DETAILED_GUIDE.md"
        
        # Pipeline phase sequence (canonical order)
        self.phase_sequence = [
            "01_ingestion",
            "02_quality",
            "03_schema",
            "03_5_textops",
            "04_profile",
            "05_missing",
            "06_standardize",
            "06_feature_eng",
            "07_readiness",
            "07_5_feature_report",
            "07_6_llm_summary",
            "07_7_business_correlations",
            "07_analytics",
            "07_timeseries",
            "07_knime_bridge",
            "08_insights",
            "09_business_validation",
            "09_5_causal",
            "10_bi",
            "11_ml_lab",
            "12_routing"
        ]
        
        # Phase metadata cache
        self._phase_metadata = {}
        self._spine_data = None
        
    def build_spine(self) -> Dict[str, Any]:
        """
        Build the Mind-Q pipeline spine from PHASES_DETAILED_GUIDE.md.
        
        Returns:
            Dictionary containing spine structure with phases, flows, and KPIs
        """
        if not self.guide_path.exists():
            return self._build_default_spine()
        
        with open(self.guide_path, 'r', encoding='utf-8') as f:
            guide_content = f.read()
        
        spine = {
            "project": "Mind-Q V4.1",
            "type": "logistics_data_pipeline",
            "generated_at": datetime.now().isoformat(),
            "phases": [],
            "flows": [],
            "kpis": self._extract_kpis(guide_content)
        }
        
        # Extract phases
        for phase_id in self.phase_sequence:
            phase_info = self._extract_phase_info(phase_id, guide_content)
            if phase_info:
                spine["phases"].append(phase_info)
        
        # Build flow edges
        spine["flows"] = self._build_phase_flows(spine["phases"])
        
        self._spine_data = spine
        return spine
    
    def _extract_kpis(self, guide_content: str) -> List[Dict[str, Any]]:
        """Extract KPIs mentioned in the guide with phase mappings."""
        kpis = [
            {
                "name": "RTO%", 
                "description": "Return to Origin percentage", 
                "category": "delivery",
                "impacted_by": ["01_ingestion", "07_readiness", "08_insights", "09_business_validation"]
            },
            {
                "name": "SLA", 
                "description": "Service Level Agreement compliance", 
                "category": "service",
                "impacted_by": ["01_ingestion", "07_readiness", "08_insights", "09_business_validation", "10_bi"]
            },
            {
                "name": "COD", 
                "description": "Cash on Delivery collection rate", 
                "category": "financial",
                "impacted_by": ["01_ingestion", "02_quality", "08_insights", "09_business_validation"]
            },
            {
                "name": "PSI", 
                "description": "Population Stability Index for data drift", 
                "category": "quality",
                "impacted_by": ["04_profile", "05_missing", "06_standardize", "07_readiness"]
            },
            {
                "name": "NZV", 
                "description": "Near Zero Variance for feature stability", 
                "category": "quality",
                "impacted_by": ["04_profile", "06_feature_eng", "07_readiness"]
            },
            {
                "name": "Delivery Success", 
                "description": "Successful delivery rate", 
                "category": "delivery",
                "impacted_by": ["01_ingestion", "08_insights", "09_business_validation", "12_routing"]
            },
            {
                "name": "Hub Efficiency", 
                "description": "Hub throughput and processing time", 
                "category": "operations",
                "impacted_by": ["08_insights", "12_routing"]
            },
            {
                "name": "Data Quality Score",
                "description": "Overall data quality and completeness",
                "category": "quality",
                "impacted_by": ["02_quality", "03_schema", "04_profile", "05_missing"]
            }
        ]
        return kpis
    
    def _extract_phase_info(self, phase_id: str, guide_content: str) -> Optional[Dict[str, Any]]:
        """Extract phase information from guide content."""
        # Normalize phase ID for searching
        search_patterns = [
            f"### Stage {phase_id.replace('_', ' ').replace('0', '').strip()}",
            f"### Stage {phase_id.split('_')[0]}",
            f"## Phase {phase_id}"
        ]
        
        phase_name = self._phase_id_to_name(phase_id)
        phase_dir = self.phases_path / phase_id
        
        return {
            "id": phase_id,
            "name": phase_name,
            "order": self.phase_sequence.index(phase_id) if phase_id in self.phase_sequence else 99,
            "exists": phase_dir.exists(),
            "group": self._get_phase_group(phase_id),
            "optional": self._is_optional_phase(phase_id)
        }
    
    def _phase_id_to_name(self, phase_id: str) -> str:
        """Convert phase ID to human-readable name."""
        name_map = {
            "01_ingestion": "Data Ingestion",
            "02_quality": "Quality Checks",
            "03_schema": "Schema Validation",
            "03_5_textops": "Text Operations",
            "04_profile": "Data Profiling",
            "05_missing": "Missing Value Repair",
            "06_standardize": "Standardization",
            "06_feature_eng": "Feature Engineering",
            "07_readiness": "Readiness Assessment",
            "07_5_feature_report": "Feature Reporting",
            "07_6_llm_summary": "LLM Summary",
            "07_7_business_correlations": "Business Correlations",
            "07_analytics": "Analytics (optional)",
            "07_timeseries": "Timeseries Analysis (optional)",
            "07_knime_bridge": "KNIME Bridge",
            "08_insights": "Insights Generation",
            "09_business_validation": "Business Validation",
            "09_5_causal": "Causal Inference (optional)",
            "10_bi": "BI Delivery",
            "11_ml_lab": "ML Lab",
            "12_routing": "Routing (optional)"
        }
        return name_map.get(phase_id, phase_id.replace('_', ' ').title())
    
    def _get_phase_group(self, phase_id: str) -> str:
        """Determine which group a phase belongs to."""
        if phase_id.startswith(('01', '02', '03', '04')):
            return "data_foundation"
        elif phase_id.startswith(('05', '06', '07')):
            return "advanced_analytics"
        elif phase_id.startswith('08'):
            return "ai_insights"
        elif phase_id.startswith(('09', '10')):
            return "business_intelligence"
        elif phase_id.startswith('11'):
            return "ml_lab"
        else:
            return "optional"
    
    def _is_optional_phase(self, phase_id: str) -> bool:
        """Check if a phase is optional in the pipeline."""
        optional_phases = [
            "03_5_textops",
            "07_analytics",
            "07_timeseries",
            "09_5_causal",
            "11_ml_lab",
            "12_routing"
        ]
        return phase_id in optional_phases
    
    def _build_phase_flows(self, phases: List[Dict]) -> List[Dict[str, str]]:
        """Build edges between phases based on sequence."""
        flows = []
        for i in range(len(phases) - 1):
            from_phase = phases[i]
            to_phase = phases[i + 1]
            
            # Skip flows from/to optional phases that don't exist
            if (from_phase.get("optional") and not from_phase.get("exists")) or \
               (to_phase.get("optional") and not to_phase.get("exists")):
                continue
            
            flows.append({
                "from": from_phase["id"],
                "to": to_phase["id"],
                "type": "sequential"
            })
        
        return flows
    
    def _build_default_spine(self) -> Dict[str, Any]:
        """Build a minimal spine when guide is not available."""
        return {
            "project": "Mind-Q V4.1",
            "type": "logistics_data_pipeline",
            "generated_at": datetime.now().isoformat(),
            "phases": [{"id": p, "name": self._phase_id_to_name(p), "order": i} 
                      for i, p in enumerate(self.phase_sequence)],
            "flows": [{"from": self.phase_sequence[i], "to": self.phase_sequence[i+1], "type": "sequential"} 
                     for i in range(len(self.phase_sequence)-1)],
            "kpis": []
        }
    
    def save_spine(self, output_path: Optional[str] = None) -> str:
        """
        Save the spine to a YAML file.
        
        Args:
            output_path: Optional custom output path. Defaults to docs/mindq_spine.yaml
            
        Returns:
            Path where the spine was saved
        """
        if self._spine_data is None:
            self.build_spine()
        
        if output_path is None:
            output_path = self.docs_path / "mindq_spine.yaml"
        else:
            output_path = Path(output_path)
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            yaml.dump(self._spine_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        
        return str(output_path)
    
    def generate_phase_card(self, phase_id: str) -> Dict[str, Any]:
        """
        Generate a phase card for a specific phase.
        
        Args:
            phase_id: Phase identifier (e.g., "01_ingestion")
            
        Returns:
            Dictionary containing phase card data
        """
        phase_dir = self.phases_path / phase_id
        phase_name = self._phase_id_to_name(phase_id)
        
        # Read guide for this phase
        guide_section = self._extract_phase_section_from_guide(phase_id)
        
        # Detect main code files
        code_files = self._find_phase_code_files(phase_id)
        
        # Build phase card
        card = {
            "phase_id": phase_id,
            "name": phase_name,
            "goal": guide_section.get("goal", f"Execute {phase_name} stage"),
            "inputs": guide_section.get("inputs", []),
            "outputs": guide_section.get("outputs", []),
            "code_files": code_files[:6],  # Limit to 6 entries
            "kpis": guide_section.get("kpis", []),
            "upstream": self._get_upstream_phases(phase_id),
            "downstream": self._get_downstream_phases(phase_id),
            "group": self._get_phase_group(phase_id),
            "optional": self._is_optional_phase(phase_id),
            "business_impact": guide_section.get("business_impact", ""),
            "generated_at": datetime.now().isoformat()
        }
        
        return card
    
    def _extract_phase_section_from_guide(self, phase_id: str) -> Dict[str, Any]:
        """Extract phase-specific section from guide with real parsing."""
        if not self.guide_path.exists():
            return self._get_default_phase_data(phase_id)
        
        with open(self.guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Default values
        section_data = self._get_default_phase_data(phase_id)
        
        # Find the stage section in the guide
        stage_num = phase_id.split('_')[0]  # e.g., "01", "03"
        
        # Build pattern to find section - looking for "### Stage 01" or "### Stage 01:"
        pattern = rf'### Stage {stage_num}[:\s]([^\n]*)\n+(.*?)(?=\n###|\Z)'
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        
        if not match:
            # Try alternate pattern without colon
            pattern = rf'### Stage {stage_num}\s+(.*?)(?=\n###|\Z)'
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        
        if not match:
            return section_data
        
        section_content = match.group(0) if match.lastindex == 1 else match.group(2)
        
        # Extract Stage Definition (as goal)
        goal_match = re.search(
            r'#### Stage Definition\s+(.*?)(?=####|\Z)',
            section_content,
            re.DOTALL
        )
        if goal_match:
            goal_text = goal_match.group(1).strip()
            # Take first sentence
            sentences = re.split(r'\.\s+', goal_text)
            if sentences:
                section_data["goal"] = sentences[0].strip() + ('.' if not sentences[0].endswith('.') else '')
                if len(section_data["goal"]) > 250:
                    section_data["goal"] = section_data["goal"][:247] + "..."
        
        # Extract Inputs
        inputs_match = re.search(
            r'#### Inputs\s+(.*?)(?=####|\Z)',
            section_content,
            re.DOTALL
        )
        if inputs_match:
            inputs_text = inputs_match.group(1).strip()
            # Extract items that look like inputs
            input_items = []
            for line in inputs_text.split('\n'):
                line = line.strip()
                if line.startswith('-'):
                    # Extract after the dash
                    item = line.lstrip('- ').strip()
                    # If it has input["xxx"], extract the xxx part
                    input_match = re.search(r'`inputs?\["([^"]+)"\]`', item)
                    if input_match:
                        input_items.append(input_match.group(1))
                    elif ':' in item:
                        # Take description before colon
                        input_items.append(item.split(':')[0].strip('`"\''))
                    elif item and len(item) < 100:
                        input_items.append(item.split('.')[0])
            
            if input_items:
                section_data["inputs"] = input_items[:5]
        
        # Extract Outputs & Reports
        outputs_match = re.search(
            r'#### Outputs & Reports\s+(.*?)(?=####|\Z)',
            section_content,
            re.DOTALL
        )
        if outputs_match:
            outputs_text = outputs_match.group(1).strip()
            # Extract artifact file names
            artifacts = re.findall(r'[├└]──\s+(\S+)|[-*]\s+`?([a-zA-Z0-9_]+\.(?:parquet|json|yaml|jsonl))`?', outputs_text)
            output_files = [a for group in artifacts for a in group if a]
            if output_files:
                section_data["outputs"] = output_files[:8]
        
        # Extract Business Objective
        business_match = re.search(
            r'#### Business Objective\s+(.*?)(?=####|\Z)',
            section_content,
            re.DOTALL
        )
        if business_match:
            business_text = business_match.group(1).strip()
            # Take first 2-3 sentences
            sentences = re.split(r'\.\s+', business_text)
            business_summary = '. '.join(sentences[:2])
            if business_summary and not business_summary.endswith('.'):
                business_summary += '.'
            section_data["business_impact"] = business_summary[:350]
        
        # Extract KPIs mentioned in this section
        kpi_keywords = ['RTO', 'SLA', 'COD', 'PSI', 'NZV', 'delivery', 'quality', 'compliance', 'drift', 'variance']
        found_kpis = set()
        for kpi in kpi_keywords:
            if re.search(rf'\b{kpi}\b', section_content, re.IGNORECASE):
                found_kpis.add(kpi.upper() if len(kpi) <= 3 else kpi.title())
        section_data["kpis"] = sorted(list(found_kpis))[:5]
        
        return section_data
    
    def _get_default_phase_data(self, phase_id: str) -> Dict[str, Any]:
        """Get default phase data as fallback."""
        return {
            "goal": f"Execute {self._phase_id_to_name(phase_id)} pipeline stage",
            "inputs": ["Upstream phase outputs"],
            "outputs": ["Phase artifacts"],
            "kpis": [],
            "business_impact": "Contributes to data quality and pipeline reliability"
        }
    
    def _find_phase_code_files(self, phase_id: str) -> List[str]:
        """Find main code files for a phase."""
        phase_dir = self.phases_path / phase_id
        code_files = []
        
        if not phase_dir.exists():
            return code_files
        
        # Look for impl.py, run.py, or other Python files
        for pattern in ["impl.py", "run.py", "*.py"]:
            for file_path in phase_dir.glob(pattern):
                if file_path.is_file() and not file_path.name.startswith('__'):
                    rel_path = file_path.relative_to(self.repo_path)
                    code_files.append(str(rel_path))
        
        # Look for config files
        for pattern in ["config.yaml", "config.json", "*.yaml", "*.json"]:
            for file_path in phase_dir.glob(pattern):
                if file_path.is_file():
                    rel_path = file_path.relative_to(self.repo_path)
                    code_files.append(str(rel_path))
                    if len(code_files) >= 6:
                        break
            if len(code_files) >= 6:
                break
        
        return code_files
    
    def _get_upstream_phases(self, phase_id: str) -> List[str]:
        """Get upstream phases for a given phase."""
        try:
            idx = self.phase_sequence.index(phase_id)
            if idx > 0:
                return [self.phase_sequence[idx-1]]
        except ValueError:
            pass
        return []
    
    def _get_downstream_phases(self, phase_id: str) -> List[str]:
        """Get downstream phases for a given phase."""
        try:
            idx = self.phase_sequence.index(phase_id)
            if idx < len(self.phase_sequence) - 1:
                return [self.phase_sequence[idx+1]]
        except ValueError:
            pass
        return []
    
    def save_phase_card(self, phase_id: str, output_dir: Optional[str] = None) -> str:
        """
        Save a phase card to a markdown file.
        
        Args:
            phase_id: Phase identifier
            output_dir: Optional custom output directory. Defaults to docs/phases/
            
        Returns:
            Path where the card was saved
        """
        card = self.generate_phase_card(phase_id)
        
        if output_dir is None:
            output_dir = self.docs_path / "phases"
        else:
            output_dir = Path(output_dir)
        
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{phase_id}.md"
        
        # Generate markdown content
        md_content = self._card_to_markdown(card)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        return str(output_file)
    
    def _card_to_markdown(self, card: Dict[str, Any]) -> str:
        """Convert phase card to markdown format."""
        md = f"""# {card['name']} ({card['phase_id']})

**Group:** {card['group'].replace('_', ' ').title()}  
**Optional:** {'Yes' if card['optional'] else 'No'}

## Goal
{card['goal']}

## Business Impact
{card['business_impact']}

## Inputs
"""
        for inp in card['inputs']:
            md += f"- {inp}\n"
        
        md += "\n## Outputs\n"
        for out in card['outputs']:
            md += f"- {out}\n"
        
        md += "\n## Main Code Files\n"
        for code_file in card['code_files']:
            md += f"- `{code_file}`\n"
        
        if card['kpis']:
            md += "\n## KPIs\n"
            for kpi in card['kpis']:
                md += f"- {kpi}\n"
        
        md += "\n## Pipeline Position\n"
        if card['upstream']:
            md += f"**Upstream:** {', '.join(card['upstream'])}\n"
        if card['downstream']:
            md += f"**Downstream:** {', '.join(card['downstream'])}\n"
        
        md += f"\n---\n*Generated: {card['generated_at']}*\n"
        
        return md
    
    def generate_all_phase_cards(self, output_dir: Optional[str] = None) -> List[str]:
        """
        Generate phase cards for all phases in the pipeline.
        
        Args:
            output_dir: Optional custom output directory
            
        Returns:
            List of paths where cards were saved
        """
        saved_paths = []
        for phase_id in self.phase_sequence:
            phase_dir = self.phases_path / phase_id
            if phase_dir.exists() or not self._is_optional_phase(phase_id):
                try:
                    path = self.save_phase_card(phase_id, output_dir)
                    saved_paths.append(path)
                except Exception as e:
                    print(f"Warning: Could not generate card for {phase_id}: {e}")
        return saved_paths
    
    # Context generation methods for LLM agents
    
    def get_spine_context(self) -> str:
        """
        Get a compact spine context string for LLM agents.
        
        Returns:
            Formatted string describing the pipeline structure
        """
        if self._spine_data is None:
            self.build_spine()
        
        context = f"# Mind-Q Pipeline Structure\n\n"
        context += f"**Type:** {self._spine_data['type']}\n"
        context += f"**Phases:** {len(self._spine_data['phases'])}\n\n"
        
        context += "## Pipeline Flow\n"
        for phase in self._spine_data['phases']:
            optional_mark = " (optional)" if phase.get('optional') else ""
            context += f"{phase['order']+1}. **{phase['id']}** - {phase['name']}{optional_mark}\n"
        
        context += "\n## Key KPIs\n"
        for kpi in self._spine_data['kpis'][:5]:  # Top 5 KPIs
            context += f"- **{kpi['name']}**: {kpi['description']}\n"
        
        return context
    
    def get_phase_context(self, phase_ids: List[str]) -> str:
        """
        Get context for specific phases.
        
        Args:
            phase_ids: List of phase identifiers
            
        Returns:
            Formatted string with phase details
        """
        context = f"# Phase Details\n\n"
        
        for phase_id in phase_ids:
            card = self.generate_phase_card(phase_id)
            context += f"## {card['name']} ({phase_id})\n"
            context += f"**Goal:** {card['goal']}\n"
            context += f"**Impact:** {card['business_impact'][:150]}...\n"
            context += f"**Files:** {', '.join(card['code_files'][:3])}\n\n"
        
        return context
    
    def get_guardian_context_for_request(self, user_request: str) -> str:
        """
        Generate optimized Guardian context based on user request.
        
        Args:
            user_request: User's request or query
            
        Returns:
            Tailored context string for the request
        """
        # Detect which phases are mentioned
        relevant_phases = []
        request_lower = user_request.lower()
        
        for phase_id in self.phase_sequence:
            phase_name = self._phase_id_to_name(phase_id).lower()
            if phase_id in request_lower or any(word in request_lower for word in phase_name.split()):
                relevant_phases.append(phase_id)
        
        # Check for KPI mentions
        kpi_context = self._detect_kpi_context(request_lower)
        
        # If no specific phases detected, provide spine overview
        if not relevant_phases and not kpi_context:
            return self.get_spine_context()
        
        # Build context
        context = ""
        
        # If KPIs mentioned, show which phases affect them
        if kpi_context:
            context += kpi_context + "\n\n"
        
        # If specific phases detected, provide detailed context
        if relevant_phases:
            context += self.get_phase_context(relevant_phases[:3])  # Limit to 3 phases
        
        return context if context else self.get_spine_context()
    
    def _detect_kpi_context(self, request_lower: str) -> str:
        """Detect KPI mentions and return relevant phase context."""
        if self._spine_data is None:
            self.build_spine()
        
        kpi_names = [kpi['name'].lower() for kpi in self._spine_data['kpis']]
        mentioned_kpis = [kpi for kpi in self._spine_data['kpis'] 
                         if kpi['name'].lower() in request_lower or 
                         any(word in request_lower for word in kpi['description'].lower().split()[:3])]
        
        if not mentioned_kpis:
            return ""
        
        context = "# Relevant KPIs\n\n"
        for kpi in mentioned_kpis[:3]:  # Limit to 3 KPIs
            context += f"**{kpi['name']}** - {kpi['description']}\n"
            if 'impacted_by' in kpi and kpi['impacted_by']:
                phases_str = ', '.join(kpi['impacted_by'][:4])
                context += f"  *Affected by phases:* {phases_str}\n"
            context += "\n"
        
        return context.strip()
    
    def get_kpi_phase_mapping(self) -> Dict[str, List[str]]:
        """
        Get mapping of KPIs to phases that impact them.
        
        Returns:
            Dictionary mapping KPI names to list of phase IDs
        """
        if self._spine_data is None:
            self.build_spine()
        
        mapping = {}
        for kpi in self._spine_data['kpis']:
            if 'impacted_by' in kpi:
                mapping[kpi['name']] = kpi['impacted_by']
        
        return mapping
    
    def get_phase_kpi_impact(self, phase_id: str) -> List[Dict[str, str]]:
        """
        Get list of KPIs impacted by a specific phase.
        
        Args:
            phase_id: Phase identifier
            
        Returns:
            List of KPI dictionaries that this phase impacts
        """
        if self._spine_data is None:
            self.build_spine()
        
        impacted_kpis = []
        for kpi in self._spine_data['kpis']:
            if 'impacted_by' in kpi and phase_id in kpi['impacted_by']:
                impacted_kpis.append({
                    "name": kpi['name'],
                    "description": kpi['description'],
                    "category": kpi['category']
                })
        
        return impacted_kpis
    
    def refresh_all(self, output_dir: Optional[str] = None) -> Dict[str, Any]:
        """
        Refresh all Mind-Q Guardian artifacts.
        
        Args:
            output_dir: Optional custom output directory
            
        Returns:
            Summary of generated artifacts
        """
        results = {
            "spine_path": None,
            "phase_cards": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # Build and save spine
        self.build_spine()
        results["spine_path"] = self.save_spine()
        
        # Generate all phase cards
        results["phase_cards"] = self.generate_all_phase_cards(output_dir)
        
        return results


# CLI Interface
def main():
    """Command-line interface for Mind-Q Guardian."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Mind-Q Guardian Adapter")
    parser.add_argument("repo_path", help="Path to Mind-Q repository")
    parser.add_argument("--build-spine", action="store_true", help="Build and save spine")
    parser.add_argument("--generate-cards", action="store_true", help="Generate all phase cards")
    parser.add_argument("--refresh-all", action="store_true", help="Refresh all artifacts")
    parser.add_argument("--phase", help="Generate card for specific phase")
    parser.add_argument("--context", help="Get context for user request")
    parser.add_argument("--kpi-mapping", action="store_true", help="Show KPI to phase mapping")
    parser.add_argument("--phase-kpis", help="Show KPIs impacted by specific phase")
    parser.add_argument("--demo", action="store_true", help="Run demo showcasing all features")
    
    args = parser.parse_args()
    
    adapter = MindQGuardianAdapter(args.repo_path)
    
    if args.build_spine:
        spine_path = adapter.save_spine()
        print(f"✅ Spine saved to: {spine_path}")
        print(f"\n📊 Generated spine with {len(adapter._spine_data['phases'])} phases and {len(adapter._spine_data['kpis'])} KPIs")
    
    elif args.generate_cards:
        cards = adapter.generate_all_phase_cards()
        print(f"✅ Generated {len(cards)} phase cards")
        for card_path in cards:
            print(f"   - {card_path}")
    
    elif args.refresh_all:
        results = adapter.refresh_all()
        print(f"✅ Refreshed all artifacts:")
        print(f"   Spine: {results['spine_path']}")
        print(f"   Phase cards: {len(results['phase_cards'])}")
    
    elif args.phase:
        card_path = adapter.save_phase_card(args.phase)
        print(f"✅ Phase card saved to: {card_path}")
        
        # Show KPIs impacted by this phase
        kpis = adapter.get_phase_kpi_impact(args.phase)
        if kpis:
            print(f"\n📊 KPIs impacted by {args.phase}:")
            for kpi in kpis:
                print(f"   - {kpi['name']}: {kpi['description']}")
    
    elif args.context:
        context = adapter.get_guardian_context_for_request(args.context)
        print(context)
    
    elif args.kpi_mapping:
        adapter.build_spine()
        mapping = adapter.get_kpi_phase_mapping()
        print("📊 KPI → Phase Mapping:\n")
        for kpi_name, phases in mapping.items():
            print(f"{kpi_name}:")
            for phase in phases:
                print(f"  - {phase}")
            print()
    
    elif args.phase_kpis:
        kpis = adapter.get_phase_kpi_impact(args.phase_kpis)
        if kpis:
            print(f"📊 KPIs impacted by {args.phase_kpis}:\n")
            for kpi in kpis:
                print(f"- **{kpi['name']}** ({kpi['category']})")
                print(f"  {kpi['description']}\n")
        else:
            print(f"No KPIs directly impacted by {args.phase_kpis}")
    
    elif args.demo:
        print("🎯 Mind-Q Guardian Adapter Demo")
        print("=" * 50)
        
        # 1. Build spine
        print("\n1️⃣ Building pipeline spine...")
        adapter.build_spine()
        print(f"   ✅ Found {len(adapter._spine_data['phases'])} phases")
        print(f"   ✅ Tracking {len(adapter._spine_data['kpis'])} KPIs")
        
        # 2. Show KPI mapping
        print("\n2️⃣ KPI → Phase Mapping (sample):")
        mapping = adapter.get_kpi_phase_mapping()
        for kpi_name in list(mapping.keys())[:3]:
            print(f"   {kpi_name}: {', '.join(mapping[kpi_name][:3])}...")
        
        # 3. Generate sample phase card
        print("\n3️⃣ Generating sample phase card (01_ingestion)...")
        card = adapter.generate_phase_card("01_ingestion")
        print(f"   Goal: {card['goal'][:80]}...")
        print(f"   Inputs: {len(card['inputs'])} | Outputs: {len(card['outputs'])}")
        
        # 4. Context generation example
        print("\n4️⃣ Context generation example:")
        query = "Fix data quality issues in profiling stage"
        context = adapter.get_guardian_context_for_request(query)
        print(f"   Query: '{query}'")
        print(f"   Context size: {len(context)} chars (vs ~150KB traditional)")
        
        # 5. Save artifacts
        print("\n5️⃣ Saving artifacts...")
        results = adapter.refresh_all()
        print(f"   ✅ Spine: {Path(results['spine_path']).name}")
        print(f"   ✅ Phase cards: {len(results['phase_cards'])}")
        
        print("\n✨ Demo complete!")
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
