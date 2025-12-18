const fs = require('fs');
const path = require('path');

// Read the context.md file
const content = fs.readFileSync('context.md', 'utf8');
const lines = content.split('\n');

// Chapter mapping
const chapters = [
  { num: 1, title: 'Introduction', dir: 'introduction', sections: ['overview', 'about-nederland', 'about-plan', 'resilience-framework'] },
  { num: 2, title: 'Land Use', dir: 'land-use', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 3, title: 'Housing', dir: 'housing', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 4, title: 'Recreation', dir: 'recreation', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 5, title: 'Transportation', dir: 'transportation', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 6, title: 'Health & Human Services', dir: 'health-human-services', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 7, title: 'Utilities & Water Resources', dir: 'utilities-water', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 8, title: 'Natural Resources & Hazards', dir: 'natural-resources-hazards', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 9, title: 'Economic Development & Arts + Culture', dir: 'economic-development', sections: ['overview', 'existing-conditions', 'objectives-strategies'] },
  { num: 10, title: 'Implementation', dir: 'implementation', sections: ['overview'] },
];

// Find chapter boundaries
function findChapterBoundaries() {
  const boundaries = [];
  let currentChapter = null;
  let currentStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match chapter headers like "# 1 Introduction" or "# 7 Utilities &"
    // Skip "# 2024 - Draft" which is not a chapter
    const chapterMatch = line.match(/^#\s+(\d+)\s+(.+)$/);
    if (chapterMatch && chapterMatch[1] !== '2024') {
      // Save previous chapter
      if (currentChapter !== null) {
        boundaries.push({
          num: currentChapter,
          start: currentStart,
          end: i - 1,
        });
      }
      
      currentChapter = parseInt(chapterMatch[1]);
      currentStart = i;
      
      // Handle multi-line chapter titles (e.g., "# 7 Utilities &" followed by "# Water Resources")
      let j = i + 1;
      // Skip blank lines and page numbers
      while (j < lines.length) {
        const nextLine = lines[j];
        // Check if next line is a continuation of the title (starts with # and capital letter)
        if (nextLine.match(/^#\s+[A-Z][^#]*$/)) {
          j++;
        } else if (nextLine.trim() === '' || nextLine.match(/^\*\*\d+ Comprehensive Plan/)) {
          j++;
        } else {
          break;
        }
      }
      currentStart = j;
      i = j - 1;
    }
  }
  
  // Add final chapter
  if (currentChapter !== null) {
    boundaries.push({
      num: currentChapter,
      start: currentStart,
      end: lines.length - 1,
    });
  }
  
  return boundaries;
}

// Extract chapter content
function extractChapter(chapterNum, start, end) {
  return lines.slice(start, end + 1).join('\n');
}

// Clean markdown content
function cleanMarkdown(text) {
  let cleaned = text;
  
  // Remove page number artifacts like "Introduction 3" or "Land Use 15" in code blocks
  cleaned = cleaned.replace(/^```\n([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+\d+\n```\n\d+\n\n/gm, '');
  
  // Remove standalone code blocks that are just page numbers or section markers
  cleaned = cleaned.replace(/^```\n\d+\n```$/gm, '');
  cleaned = cleaned.replace(/^```\n\*\*\d+ Comprehensive Plan.*?\*\*\n```$/gm, '');
  
  // Convert code blocks that contain actual text content (not code) to regular paragraphs
  // This handles PDF artifacts where text was wrapped in code blocks
  cleaned = cleaned.replace(/^```\n([^`\n]+(?:\n[^`\n]+)*)\n```$/gm, (match, content) => {
    // If it doesn't look like code (no brackets, semicolons, etc.) and is longer text, convert to paragraph
    if (!content.match(/[{}();=<>]/) && content.length > 30 && !content.match(/^\d+$/)) {
      // Split into paragraphs if there are multiple lines
      const paragraphs = content.split('\n').filter(p => p.trim());
      return paragraphs.map(p => p.trim()).join('\n\n');
    }
    return match;
  });
  
  // Fix line breaks within paragraphs (PDF parsing often breaks lines mid-sentence)
  // Join lines that don't end with sentence-ending punctuation and aren't headers/lists
  const lines = cleaned.split('\n');
  const fixedLines = [];
  let currentParagraph = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // If it's a blank line, header, list item, or code block, flush current paragraph
    if (trimmed === '' || 
        trimmed.match(/^#+\s/) || 
        trimmed.match(/^[-*+]\s/) ||
        trimmed.match(/^\d+\.\s/) ||
        trimmed.match(/^```/)) {
      if (currentParagraph.length > 0) {
        fixedLines.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
      fixedLines.push(line);
    } else {
      // Check if line ends with sentence punctuation
      if (trimmed.match(/[.!?]$/)) {
        currentParagraph.push(trimmed);
        fixedLines.push(currentParagraph.join(' '));
        currentParagraph = [];
      } else {
        currentParagraph.push(trimmed);
      }
    }
  }
  
  if (currentParagraph.length > 0) {
    fixedLines.push(currentParagraph.join(' '));
  }
  
  cleaned = fixedLines.join('\n');
  
  // Remove excessive blank lines but preserve structure
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
  
  // Clean up any remaining artifacts
  cleaned = cleaned.replace(/^\*\*\d+ Comprehensive Plan.*?\*\*$/gm, '');
  
  return cleaned;
}

// Split chapter into sections
function splitChapterIntoSection(chapterContent, chapterInfo) {
  const sections = {
    overview: '',
    'about-nederland': '',
    'about-plan': '',
    'resilience-framework': '',
    'existing-conditions': '',
    'objectives-strategies': '',
  };
  
  const lines = chapterContent.split('\n');
  let currentSection = 'overview';
  let currentContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section boundaries based on headings
    if (chapterInfo.num === 1) {
      // Introduction chapter has special sections
      if (line.match(/^##\s+We are Nederland$/i)) {
        if (currentContent.length > 0 && currentSection === 'overview') {
          sections.overview = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'overview';
      } else if (line.match(/^##\s+About Nederland$/i)) {
        if (currentSection === 'overview') {
          sections.overview = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'about-nederland';
      } else if (line.match(/^##\s+About This Plan$/i)) {
        if (currentSection === 'about-nederland') {
          sections['about-nederland'] = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'about-plan';
      } else if (line.match(/^##\s+Plan Framework: Resilience$/i)) {
        if (currentSection === 'about-plan') {
          sections['about-plan'] = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'resilience-framework';
      } else {
        currentContent.push(line);
      }
    } else {
      // Other chapters: intro paragraph -> Existing Conditions -> Vision Statement -> Objectives & Strategies
      if (line.match(/^##\s+Existing Conditions/i)) {
        if (currentSection === 'overview') {
          sections.overview = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'existing-conditions';
      } else if (line.match(/^##\s+Vision Statement/i)) {
        // Vision statement is usually part of objectives-strategies or a separate intro
        if (currentSection === 'existing-conditions') {
          sections['existing-conditions'] = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'objectives-strategies';
      } else if (line.match(/^##\s+Objectives/i)) {
        if (currentSection === 'existing-conditions') {
          sections['existing-conditions'] = currentContent.join('\n').trim();
        }
        currentContent = [line];
        currentSection = 'objectives-strategies';
      } else {
        currentContent.push(line);
      }
    }
  }
  
  // Save final section
  if (currentContent.length > 0) {
    const existing = sections[currentSection] || '';
    sections[currentSection] = (existing + '\n\n' + currentContent.join('\n')).trim();
  }
  
  return sections;
}

// Main execution
const boundaries = findChapterBoundaries();
console.log(`Found ${boundaries.length} chapters`);

// Create docs directory structure
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Process each chapter
boundaries.forEach((boundary, index) => {
  const chapterInfo = chapters.find(c => c.num === boundary.num);
  if (!chapterInfo) {
    console.log(`Warning: No chapter info found for chapter ${boundary.num}`);
    return;
  }
  
  const chapterDir = path.join(docsDir, chapterInfo.dir);
  if (!fs.existsSync(chapterDir)) {
    fs.mkdirSync(chapterDir, { recursive: true });
  }
  
  // Extract chapter content
  let chapterContent = extractChapter(boundary.num, boundary.start, boundary.end);
  
  // Clean the content
  chapterContent = cleanMarkdown(chapterContent);
  
  // Remove the chapter title header lines but keep the content
  chapterContent = chapterContent.replace(/^#\s+\d+\s+.*$/m, '');
  // Remove continuation title lines (like "# Water Resources" after "# 7 Utilities &")
  chapterContent = chapterContent.replace(/^#\s+[A-Z][^#\n]*$/m, '');
  // Remove page number headers
  chapterContent = chapterContent.replace(/^\*\*\d+ Comprehensive Plan.*?\*\*$/gm, '');
  
  // Split into sections
  const sections = splitChapterIntoSection(chapterContent, chapterInfo);
  
  // Write section files
  chapterInfo.sections.forEach(sectionName => {
    let sectionContent = sections[sectionName] || '';
    
    // Add frontmatter
    const frontmatter = `---
title: ${chapterInfo.title}${sectionName !== 'overview' ? ` - ${sectionName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` : ''}
sidebar_position: ${chapterInfo.sections.indexOf(sectionName) + 1}
---

`;
    
    // If section is empty, create a placeholder
    if (!sectionContent.trim()) {
      sectionContent = `# ${chapterInfo.title}\n\nContent for this section is being organized.`;
    }
    
    const filePath = path.join(chapterDir, `${sectionName}.md`);
    fs.writeFileSync(filePath, frontmatter + sectionContent);
    console.log(`Created: ${filePath}`);
  });
  
  // Create _category_.json
  const categoryJson = {
    label: chapterInfo.title,
    position: chapterInfo.num,
  };
  fs.writeFileSync(
    path.join(chapterDir, '_category_.json'),
    JSON.stringify(categoryJson, null, 2)
  );
});

console.log('Parsing complete!');

