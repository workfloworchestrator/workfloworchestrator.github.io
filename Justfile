# Copyright 2026 Internet2
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# List possible recipes
default:
    @just --list

# Install/sync virtual environment with UV
sync:
    uv sync --all-groups --all-extras

# Serve workfloworchestrator.org on http://127.0.0.1:3000/
docs-preview:
    @just sync
    uv run mkdocs serve --livereload

# Checkout sub-projects
setup-subprojects:
    ./setup_subprojects.sh

# Run pre-commit on all files
pre-commit:
    uv run pre-commit run --all-files

# Install pre-commit script into .git/hooks/pre-commit
pre-commit-install:
    uv run pre-commit install
