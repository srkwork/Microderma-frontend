import type { PaperSummary, PaperDetail, TaxonRecord, RecommendationRequest, RecommendationResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        cache: "no-store",
    });
    if(!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body),
    });
    if(!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
}


// ---------- Papers ----------

export interface ListPapersParams{
    limit?: number;
    offset?: number;
    journal?: string;
    year?: number;
    min_year?: number;
}

export async function listPapers(
    params: ListPapersParams = {}
): Promise<PaperSummary[]> {
    const query = new URLSearchParams();
    if(params.limit) query.set("limit", String(params.limit));
    if(params.offset) query.set("offset", String(params.offset));
    if(params.journal) query.set("journal", params.journal);
    if(params.year) query.set("year", String(params.year));
    if(params.min_year) query.set("year", String(params.min_year));

    const qs = query.toString();
    return apiGet<PaperSummary[]>(`/papers/${qs ? "?" + qs : ""}`);
}


// ---------- Microbes ----------

export interface SearchMicrobesParams{
    name?: string;
    condition?: string;
    min_year?: number;
    limit?: number;
}

export async function searchMicrobes(
    params: SearchMicrobesParams = {}
): Promise<TaxonRecord[]> {
    const query = new URLSearchParams();
    if(params.name) query.set("name", params.name);
    if(params.condition) query.set("condition", params.condition);
    if(params.min_year) query.set("min year", String(params.min_year));
    if(params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    return apiGet<TaxonRecord[]>(`/microbes/search${qs ? "?" + qs : ""}`);
}

export interface TopMicrobe {
    bacterial_species: string;
    paper_count: number;
}

export async function getTopMicrobes(limit = 10) : Promise<TopMicrobe[]> {
    return apiGet<TopMicrobe[]>(`/microbes/top?limit=${limit}`);
}

// ---------- Recommendations ----------

export async function getRecommendations(
    req: RecommendationRequest
): Promise<RecommendationResponse[]> {
    return apiPost<RecommendationResponse[]>("/recommendations/", req);
}

// ---------- Health check ----------

export async function checkHealth(): Promise<{status: string}> {
    return apiGet("/health");
}