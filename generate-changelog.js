const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate changelog from git commits
 */
class ChangelogGenerator {
  constructor() {
    this.changelogFile = path.join(__dirname, 'CHANGELOG.md');
  }

  /**
   * Execute git command and return result
   */
  execGitCommand(command) {
    try {
      return execSync(command, { encoding: 'utf8', cwd: __dirname }).trim();
    } catch (error) {
      console.error(`Error executing git command: ${command}`);
      console.error(error.message);
      return '';
    }
  }

  /**
   * Parse existing changelog to get the latest version
   */
  getLatestVersionFromChangelog() {
    try {
      const changelogContent = fs.readFileSync(this.changelogFile, 'utf8');
      const versionMatch = changelogContent.match(/### (\d+\.\d+\.\d+) \(/);
      return versionMatch ? versionMatch[1] : null;
    } catch (error) {
      console.error('Error reading CHANGELOG.md:', error.message);
      return null;
    }
  }

  /**
   * Get all existing versions from changelog
   */
  getExistingVersionsFromChangelog() {
    try {
      const changelogContent = fs.readFileSync(this.changelogFile, 'utf8');
      const versionMatches = changelogContent.match(/### (\d+\.\d+\.\d+) \(/g);
      if (!versionMatches) return [];
      
      return versionMatches.map(match => {
        const version = match.match(/### (\d+\.\d+\.\d+) \(/)[1];
        return version;
      });
    } catch (error) {
      console.error('Error reading CHANGELOG.md:', error.message);
      return [];
    }
  }

  /**
   * Compare versions to check if version1 is newer than version2
   */
  isVersionNewer(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return true;
      if (v1Part < v2Part) return false;
    }
    
    return false; // versions are equal
  }

  /**
   * Get latest git tags
   */
  getLatestTags(limit = 20) {
    const command = `git tag --sort=-version:refname | head -${limit}`;
    const output = this.execGitCommand(command);
    return output ? output.split('\n').filter(tag => tag.trim()) : [];
  }

  /**
   * Get commits between two references
   */
  getCommitsBetweenTags(fromTag, toTag = 'HEAD') {
    let command;
    if (!fromTag) {
      command = `git log HEAD --pretty=format:"%H|%s|%ad" --date=short`;
    } else if (toTag === 'HEAD') {
      command = `git log ${fromTag}..HEAD --pretty=format:"%H|%s|%ad" --date=short`;
    } else {
      command = `git log ${fromTag}..${toTag} --pretty=format:"%H|%s|%ad" --date=short`;
    }
    
    const output = this.execGitCommand(command);
    if (!output) return [];

    return output.split('\n').map(line => {
      const [hash, message, date] = line.split('|');
      return { hash, message, date };
    }).filter(commit => commit.hash);
  }

  /**
   * Filter commits based on criteria
   * - Remove merge commits
   * - Remove commits with less than 5 characters
   */
  filterCommits(commits) {
    return commits.filter(commit => {
      const message = commit.message.trim();
      
      // Filter out merge commits
      if (message.toLowerCase().includes('merge') || 
          message.match(/^merge\s+/i) ||
          message.match(/^Merge\s+(branch|pull\s+request|remote-tracking)/i)) {
        console.log(`Filtered out merge commit: ${message}`);
        return false;
      }
      
      // Filter out commits with less than 5 characters
      if (message.length < 5) {
        console.log(`Filtered out short commit: ${message}`);
        return false;
      }
      
      return true;
    });
  }

  /**
   * Normalize text for comparison by removing common prefixes and cleaning up
   */
  normalizeCommitText(message) {
    return message
      .replace(/^(feat|feature|fix|bugfix|chore|docs|style|refactor|test):\s*/i, '')
      .replace(/^(新增|增加|修复|解决|修改|更新|优化)[:：]\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /**
   * Merge commits with identical content
   */
  mergeIdenticalCommits(commits) {
    const uniqueCommits = [];
    const seenTexts = new Map();
    
    commits.forEach(commit => {
      const normalizedText = this.normalizeCommitText(commit.message);
      
      if (seenTexts.has(normalizedText)) {
        console.log(`Merged duplicate commit: ${commit.message}`);
        // Keep the first occurrence, ignore duplicates
        return;
      }
      
      seenTexts.set(normalizedText, true);
      uniqueCommits.push(commit);
    });
    
    console.log(`Merged ${commits.length - uniqueCommits.length} duplicate commits`);
    return uniqueCommits;
  }

  /**
   * Categorize commit messages
   */
  categorizeCommits(commits) {
    // First filter commits, then merge identical ones
    const filteredCommits = this.filterCommits(commits);
    const uniqueCommits = this.mergeIdenticalCommits(filteredCommits);
    
    const categories = {
      features: [],
      bugfixes: [],
      others: []
    };

    uniqueCommits.forEach(commit => {
      const message = commit.message.toLowerCase();
      
      if (message.includes('feat:') || message.includes('feature:') || 
          message.includes('新增') || message.includes('增加') || 
          message.includes('add:') || message.includes('support:')) {
        categories.features.push(this.formatCommitMessage(commit.message));
      } else if (message.includes('fix:') || message.includes('bugfix:') || 
                 message.includes('修复') || message.includes('解决') ||
                 (message.includes('修改') && message.includes('问题'))) {
        categories.bugfixes.push(this.formatCommitMessage(commit.message));
      } else {
        categories.others.push(this.formatCommitMessage(commit.message));
      }
    });

    return categories;
  }

  /**
   * Format commit message to remove prefixes and clean up
   */
  formatCommitMessage(message) {
    let formatted = message
      .replace(/^(feat|feature|fix|bugfix|chore|docs|style|refactor|test):\s*/i, '')
      .replace(/^(新增|增加|修复|解决|修改|更新|优化)[:：]\s*/i, '')
      .trim();

    if (!formatted.match(/^(增加|新增|修复|解决|更新|优化|支持|调整)/)) {
      if (message.toLowerCase().includes('fix') || message.includes('修复') || message.includes('解决')) {
        formatted = '修复' + (formatted.startsWith('了') ? formatted.substring(1) : formatted);
      }
    }

    return formatted;
  }

  /**
   * Get current version from package.json
   */
  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.version;
    } catch (error) {
      console.error('Error reading package.json:', error.message);
      return '0.0.0';
    }
  }

  /**
   * Generate changelog content for new versions only
   */
  generateNewChangelogEntries() {
    const currentVersion = this.getCurrentVersion();
    const currentDate = new Date().toISOString().split('T')[0];
    const latestChangelogVersion = this.getLatestVersionFromChangelog();
    const existingVersions = this.getExistingVersionsFromChangelog();
    const tags = this.getLatestTags();
    
    let newEntries = '';
    console.log(`Current version: ${currentVersion}`);
    console.log(`Latest changelog version: ${latestChangelogVersion}`);

    // Check if current version is newer than the latest in changelog
    if (!latestChangelogVersion || this.isVersionNewer(currentVersion, latestChangelogVersion)) {
      let fromReference = latestChangelogVersion || (tags.length > 0 ? tags[0] : '');
      
      if (latestChangelogVersion) {
        const matchingTag = tags.find(tag => tag === latestChangelogVersion || tag === `v${latestChangelogVersion}`);
        fromReference = matchingTag || fromReference;
      }

      const commits = this.getCommitsBetweenTags(fromReference, 'HEAD');
      console.log(`Found ${commits.length} commits since ${fromReference || 'beginning'}`);
      
      if (commits.length > 0) {
        const categories = this.categorizeCommits(commits);
        
        newEntries += `### ${currentVersion} (${currentDate})\n\n`;
        
        if (categories.features.length > 0) {
          newEntries += '#### New Features\n\n';
          categories.features.forEach(feature => {
            newEntries += `- ${feature}\n`;
          });
          newEntries += '\n';
        }

        if (categories.bugfixes.length > 0) {
          newEntries += '#### Bug Fixes\n\n';
          categories.bugfixes.forEach(fix => {
            newEntries += `- ${fix}\n`;
          });
          newEntries += '\n';
        }
      }
    }

    // Add previous tags that are not in existing changelog
    for (const tag of tags) {
      const cleanTag = tag.replace(/^v/, '');
      
      if (existingVersions.includes(cleanTag) || 
          (latestChangelogVersion && !this.isVersionNewer(cleanTag, latestChangelogVersion))) {
        continue;
      }

      const tagIndex = tags.indexOf(tag);
      const nextTag = tags[tagIndex + 1];
      
      if (nextTag) {
        const commits = this.getCommitsBetweenTags(nextTag, tag);
        
        if (commits.length > 0) {
          const tagDate = this.execGitCommand(`git log -1 --format=%ad --date=short ${tag}`);
          const categories = this.categorizeCommits(commits);
          
          newEntries += `### ${cleanTag} (${tagDate})\n\n`;
          
          if (categories.features.length > 0) {
            newEntries += '#### New Features\n\n';
            categories.features.forEach(feature => {
              newEntries += `- ${feature}\n`;
            });
            newEntries += '\n';
          }

          if (categories.bugfixes.length > 0) {
            newEntries += '#### Bug Fixes\n\n';
            categories.bugfixes.forEach(fix => {
              newEntries += `- ${fix}\n`;
            });
            newEntries += '\n';
          }
        }
      }
    }

    return newEntries;
  }

  /**
   * Prepend new changelog entries to existing changelog
   */
  prependToChangelog(newEntries) {
    try {
      const existingContent = fs.readFileSync(this.changelogFile, 'utf8');
      const updatedContent = newEntries + existingContent;
      fs.writeFileSync(this.changelogFile, updatedContent, 'utf8');
      return true;
    } catch (error) {
      console.error('Error updating CHANGELOG.md:', error.message);
      return false;
    }
  }

  /**
   * Generate and append changelog entries
   */
  generate() {
    console.log('🚀 Generating new changelog entries from git commits...');
    
    try {
      const newEntries = this.generateNewChangelogEntries();
      
      if (!newEntries.trim()) {
        console.log('✅ No new versions to add to changelog');
        return;
      }

      // Prepend new entries to existing changelog
      const success = this.prependToChangelog(newEntries);
      
      if (success) {
        console.log(`✅ New changelog entries added successfully to ${this.changelogFile}`);
        console.log('\n📄 New entries added:');
        console.log('='.repeat(50));
        console.log(newEntries.substring(0, 500) + (newEntries.length > 500 ? '...' : ''));
        console.log('='.repeat(50));
      } else {
        console.error('❌ Failed to update changelog file');
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Error generating changelog:', error.message);
      process.exit(1);
    }
  }
}

// Run the changelog generator
if (require.main === module) {
  const generator = new ChangelogGenerator();
  generator.generate();
}

module.exports = ChangelogGenerator;