import { NapiAdditionalIssueSource } from "next/dist/build/swc/generated-native";

export interface PaperSummary{
    paper_id: number;
    pmid: number | null;
    title: string;
    authors: string | null;
    journal: string | null;
    publication_year: number | null;
    doi: string | null;
}

export interface PaperDetail extends PaperSummary{
    preprint_status: string | null;
    date_availability: string | null;
    extraction_source: string | null;
    demographics?: PopulationDemographics[];
    study_design?: StudyDesign[];
    findings?: Findings[];
    microbiome_data?: TaxonRecord[];
    diversity_metrics?: DiversityMetric[];
    quality_assessment?: QualityAssessment[];
}

export interface PopulationDemographics{
    health_condition_bucket: string | null;
    sample_size: number | null;
    age_range: string | null;
    sex_distribution: string | null;
    ethnicity_race: string | null;
    geographic_region: string | null;
    inclusion_exclusion: string | null;
}

export interface StudyDesign{
    study_type: string | null;
    control_group: string | null;
    skin_site_sampled: string | null;
    sampling_method: string | null;
    sequencing_method: string | null;
    bioinformatics_pipeline: string | null;
    reference_database: string | null;
}

export interface Findings{
    primary_findings: string | null;
    statistical_tests: string | null;
    p_values_fdr: string | null;
    reported_associations: string | null;
    genetic_data: string | null;
}

export interface TaxonRecord{
    taxa_id: number;
    paper_id: number;
    bacterial_species: string | null;
    level: string | null;
    relative_abundance: string | null;
    absolute_abundance: string | null;
    enriched_depleted: string | null;
    condition_compared: string | null;
    p_value: string | null;
}

export interface DiversityMetric{
    metric_type: string | null;
    metric_value: string | null;
    condition: string | null;
}

export interface QualityAssessment{
    sample_size_adequate: string | null;
    controls_present: string | null;
    statistical_rigor: string | null;
    peer_review_status: string | null;
    red_flags: string | null;
    overall_quality_rating: string | null;
}

export interface RecommendationRequest{
    skin_condition?: string;
    body_site?: string;
    skin_type?: string;
}

export interface RecommendationResponse{
    rational: string;
    relevant_microbes: string[];
    supporting_paper_ids: number[];
    confidence: "low" | "medium" | "high";
}