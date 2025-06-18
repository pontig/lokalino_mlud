input_fragments =  ["DAMIANI DI MORBEGNO",
"GROSIO SCUOLA SECOND. I GRADO",
"GROSOTTO SC. SECONDARIA I GRADO",
"I.P. Industria e Artigianato - B. Pinchetti",
"I.T. Economico - Liebniz",
"I.T. Economico e Tecnologico - B. Pinchetti",
"I.T. Economico e Tecnologico - Leonardo da Vinci",
"I.T. Tecnologico - E. Mattei",
"ISTITUTO PROFESSIONALE BESTA-FOSSATI",
"Istituto Professionale Crotto Caurga",
"ISTITUTO TECNICO AGRARIO, Sondrio",
"Istituto Tecnico Statale A. De Simoni - M. Quadrio",
"L. Scientifico - B. Pinchetti",
"L. Scientifico - Istituto Leonardo da Vinci",
"LICEO P. Nervi - G. Ferrari - Morbegno",
"MARIA CECILIA TURCHI - Scuola paritaria",
"PIETRO SIGISMUND -CHIESA VAL.CO",
"Secondaria Primo Grado - Aprica",
"Secondaria Primo Grado - Campodolcino",
"Secondaria Primo Grado - Cepina",
"Secondaria Primo Grado - Cipriano Valorsa",
"Secondaria Primo Grado - Delebio",
"Secondaria Primo Grado - Dubino",
"Secondaria Primo Grado - E. Vanoni",
"Secondaria Primo Grado - E.Vanoni",
"Secondaria Primo Grado - F. Sassi",
"Secondaria Primo Grado - G. Bertacchi",
"Secondaria Primo Grado - G. Garibaldi",
"Secondaria Primo Grado - G.P. Ligari",
"Secondaria Primo Grado - Gordona",
"Secondaria Primo Grado - Isolaccia",
"Secondaria Primo Grado - L. Trombini",
"Secondaria Primo Grado - M. Anzi",
"Secondaria Primo Grado - Novate Mezzola",
"Secondaria Primo Grado - Regoledo di Cosio",
"Secondaria Primo Grado - S. Antonio",
"Secondaria Primo Grado - San Pietro",
"Secondaria Primo Grado - Sez. Albosaggia",
"Secondaria Primo Grado - Talamona",
"Secondaria Primo Grado - Traona",
"Secondaria Primo Grado - Tresenda",
"Secondaria Primo Grado - Villa di Tirano",
"SONDALO SC. SECONDARIA I GRADO"]

ground_truth = ["Vanoni, Morbegno Istituto Comprensivo",
"Damiani, Morbegno Istituto Comprensivo",
"Talamona Istituto Comprensivo",
"Ardenno Istituto Comprensivo",
"Traona Istituto Comprensivo",
"Delebio Istituto Comprensivo",
"Aprica Istituto Comprensivo",
"Campodolcino Istituto Comprensivo",
"Cepina Istituto Comprensivo",
"Berbenno Istituto Comprensivo",
"Dubino Istituto Comprensivo",
"Paesi Orobici, Sondrio Istituto Comprensivo",
"Paesi Retici, Sondrio Istituto Comprensivo",
"Bertacchi, Chiavenna Istituto Comprensivo",
"Garibaldi, Chiavenna Istituto Comprensivo",
"Ligari, Sondrio Istituto Comprensivo",
"Gordona Istituto Comprensivo",
"Isolaccia Istituto Comprensivo",
"Trombini, Tirano Istituto Comprensivo",
"Bormio Istituto Comprensivo",
"Novate Mezzola Istituto Comprensivo",
"Regoledo di Cosio Istituto Comprensivo",
"Albosaggia Istituto Comprensivo",
"Tresenda Istituto Comprensivo",
"Villa di Tirano Istituto Comprensivo",
"Grosio Istituto Comprensivo",
"Grosotto Istituto Comprensivo",
"Sondalo Istituto Comprensivo",
"Sondrio, Maria Cecilia Turchi Istituto Comprensivo",
"Chiesa Valmalenco Istituto Comprensivo",
"Liceo P. Nervi - G. Ferrari, Morbegno",
"Istituto Superiore P. Saraceno e G. P. Romegialli, Morbegno",
"ENAIP, Morbegno",
"Liceo G. Piazzi - C. Lena Perpenti, Sondrio",
"Liceo Scientifico Donegani, Sondrio",
"Istituto Tecnico A. De Simoni - M. Quadrio, Sondrio",
"ITI E. Mattei, Sondrio",
"Istituto Superiore Besta e Fossati, Sondrio",
"Istituto Pio XII, Sondrio",
"APF, Sondrio",
"Istituto Tecnico A. De Simoni - M. Quadrio, Sondrio",
"Istituto di Istruzione Superiore Alberti, Bormio",
"APF, Sondalo",
"Istituto di Istruzione Superiore Leonardo da Vinci, Chiavenna",
"Istituto Professionale Alberghiero Crotto Caurga, Chiavenna",
"Istituto di Istruzione Superiore Balilla Pinchetti, Tirano"]

#!/usr/bin/env python3
"""
School Name Matching Script
Finds the best 3 matches from ground truth for each input fragment
"""

import re
from typing import List, Tuple, Dict
import argparse


class SchoolMatcher:
    def __init__(self, ground_truth: List[str]):
        """
        Initialize the matcher with ground truth school names
        
        Args:
            ground_truth: List of complete school names
        """
        self.ground_truth = ground_truth
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for better matching"""
        return re.sub(r'\s+', ' ', text.strip().lower())
    
    def exact_match(self, fragment: str) -> List[Tuple[str, float, str]]:
        """Try exact case-insensitive match"""
        fragment_norm = self.normalize_text(fragment)
        matches = []
        
        for school in self.ground_truth:
            school_norm = self.normalize_text(school)
            if fragment_norm == school_norm:
                matches.append((school, 1.0, "exact"))
        
        return matches
    
    def substring_match(self, fragment: str) -> List[Tuple[str, float, str]]:
        """Find schools containing the fragment"""
        fragment_norm = self.normalize_text(fragment)
        matches = []
        
        for school in self.ground_truth:
            school_norm = self.normalize_text(school)
            if fragment_norm in school_norm:
                # Score based on how much of the school name the fragment covers
                coverage = len(fragment_norm) / len(school_norm)
                matches.append((school, coverage, "substring"))
        
        return matches
    
    def word_boundary_match(self, fragment: str) -> List[Tuple[str, float, str]]:
        """Match based on word boundaries and word coverage"""
        fragment_words = self.normalize_text(fragment).split()
        matches = []
        
        for school in self.ground_truth:
            school_norm = self.normalize_text(school)
            school_words = school_norm.split()
            
            matched_words = 0
            total_fragment_chars = 0
            matched_chars = 0
            
            for frag_word in fragment_words:
                total_fragment_chars += len(frag_word)
                for school_word in school_words:
                    if frag_word in school_word or school_word in frag_word:
                        matched_words += 1
                        matched_chars += len(frag_word)
                        break
            
            if matched_words > 0:
                # Combined score: word coverage + character coverage
                word_score = matched_words / len(fragment_words)
                char_score = matched_chars / total_fragment_chars if total_fragment_chars > 0 else 0
                combined_score = (word_score * 0.7) + (char_score * 0.3)
                matches.append((school, combined_score, "word_boundary"))
        
        return matches
    
    def fuzzy_match(self, fragment: str) -> List[Tuple[str, float, str]]:
        """Fuzzy matching using character-level similarity"""
        fragment_norm = self.normalize_text(fragment)
        matches = []
        
        for school in self.ground_truth:
            school_norm = self.normalize_text(school)
            
            # Simple character-based similarity
            if len(fragment_norm) == 0:
                continue
                
            # Count common characters
            common_chars = 0
            frag_chars = list(fragment_norm.replace(' ', ''))
            school_chars = list(school_norm.replace(' ', ''))
            
            for char in frag_chars:
                if char in school_chars:
                    common_chars += 1
                    school_chars.remove(char)  # Remove to avoid double counting
            
            similarity = common_chars / len(frag_chars) if len(frag_chars) > 0 else 0
            
            # Only include if similarity is above threshold
            if similarity >= 0.3:
                matches.append((school, similarity, "fuzzy"))
        
        return matches
    
    def find_best_matches(self, fragment: str, top_k: int = 3) -> List[Tuple[str, float, str]]:
        """
        Find the best matching schools for a fragment
        
        Args:
            fragment: Input fragment to match
            top_k: Number of top matches to return
            
        Returns:
            List of tuples (school_name, score, match_type)
        """
        all_matches = []
        
        # Try different matching strategies
        strategies = [
            self.exact_match,
            self.substring_match,
            self.word_boundary_match,
            self.fuzzy_match
        ]
        
        for strategy in strategies:
            matches = strategy(fragment)
            all_matches.extend(matches)
        
        # Remove duplicates and keep the best score for each school
        school_scores = {}
        for school, score, match_type in all_matches:
            if school not in school_scores or score > school_scores[school][0]:
                school_scores[school] = (score, match_type)
        
        # Convert back to list and sort by score
        final_matches = [(school, score, match_type) 
                        for school, (score, match_type) in school_scores.items()]
        final_matches.sort(key=lambda x: x[1], reverse=True)
        
        return final_matches[:top_k]


def load_file(filename: str) -> List[str]:
    """Load lines from a file, removing empty lines"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found")
        return []
    except Exception as e:
        print(f"Error reading file '{filename}': {e}")
        return []


def main():
    parser = argparse.ArgumentParser(description='Match school name fragments to ground truth')
    parser.add_argument('--top-k', type=int, default=3, help='Number of top matches to show (default: 3)')
    parser.add_argument('--min-score', type=float, default=0.1, help='Minimum score threshold (default: 0.1)')
    
    args = parser.parse_args()
    

    
    if not ground_truth:
        print("No ground truth data loaded. Exiting.")
        return
    
    if not input_fragments:
        print("No input fragments loaded. Exiting.")
        return
    
    print(f"Loaded {len(ground_truth)} ground truth schools")
    print(f"Loaded {len(input_fragments)} input fragments")
    print(f"Finding top {args.top_k} matches for each fragment")
    print("-" * 80)
    
    # Initialize matcher
    matcher = SchoolMatcher(ground_truth)
    
    # Process each fragment
    for i, fragment in enumerate(input_fragments, 1):
        print(f"\n{i}. Input fragment: '{fragment}'")
        matches = matcher.find_best_matches(fragment, args.top_k)
        
        if matches:
            print("   Best matches:")
            for j, (school, score, match_type) in enumerate(matches, 1):
                if score >= args.min_score:
                    print(f"   {j}. {school}")
                    print(f"      Score: {score:.3f} | Method: {match_type}")
        else:
            print("   No matches found")
    
    print("\n" + "=" * 80)
    print("Matching complete!")


if __name__ == "__main__":
    # Example usage if run without arguments
    import sys
    main()