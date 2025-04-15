// DEVELOPER NOTE: This file contains code for MCP developer/automation integration.
// MCP is NOT a user-facing feature of MUA. Any MCP-related code here is for development or agent automation only.
// Do NOT expose MCP features to end users.

import { useState } from 'react';

// MCP implementation temporarily removed for restructuring

export const RepoInput = () => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // MCP functionality temporarily disabled
    // Will be reimplemented in the new MCP structure
    console.log('Repository URL submitted:', repoUrl);
    // This will be connected to MCP in the new implementation
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg fixed bottom-4 right-4">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter repository URL"
          className="px-3 py-2 border border-gray-300 rounded"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};