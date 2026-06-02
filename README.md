## Blue Marloc Main

### Overview
Core Drupal 11 module that provides the shared admin navigation, base libraries, and utility helpers used by all Blue Marloc modules.

### Features
- Top-level “Blue Marloc” admin menu with sections for Administration, Entity, Data production, Management, Enhancements, and Development/Reports.
- Shared libraries for admin UX, including sidebar dialog support and prerender (speculation rules) on the main menu.
- Utility helpers: URL parsing, panel/help markup, last-uploaded file tracking, modal messenger rendering, language helper.
- Admin menu overview UX enhancer (collapsible branches, quick filter, safer drag) on `/admin/structure/menu/manage/admin` via the bm_main menu_overview_enhance library.

### Technical Stack
- Drupal 11 / PHP 8.3
- Core APIs only; no front-end framework requirements.

### Installation
1. Ensure DDEV stack is running: `ddev start`
2. Enable module: `ddev exec drush en bm_main -y`
3. Clear caches: `ddev exec drush cr`

### Configuration
- Admin sections and landing pages are auto-generated via `bm_main.links.menu.yml`.
- Speculation rules prerender attaches automatically to the `main` menu via `bm_main_preprocess_menu`.

### Usage
- Place submenu items under the provided parents (e.g., `bm_main.bluemarloc_admin`, `bm_main.bluemarloc_entity`, `bm_main.bluemarloc_data`, `bm_main.bluemarloc_manager`, `bm_main.bluemarloc_enhancements`, `bm_main.bluemarloc_developer`, `bm_main.bluemarloc_developer_tools`).
- Admin menu overview enhancements:
  - Expand/Collapse all controls and per-branch toggles.
  - Quick filter to highlight matching items; ancestors of matches stay visible.
  - Drag handles are disabled on collapsed branches to avoid accidental moves.
- Helpers:
  - `bm_main_get_url_arguments($names, $types)` — sanitized query args.
  - `bm_main_parse_string_arguments($queryString)` — parse key/value strings.
  - `bm_main_panel_title_and_help()` / `bm_main_title_and_help()` — render title + tooltip help (bm_tooltip-based).
  - `bm_xlsx_get_last_uploaded_fid()` / `bm_xlsx_get_last_uploaded_file_path()` — retrieve last stored upload.
  - `bm_main_response_messages(AjaxResponse $response)` — push messenger messages into a modal.
  - `bm_main_get_current_language()` — array of content/interface/url langcodes.

### Code Examples
```php
// URL sanitization.
$args = bm_main_get_url_arguments(['id'], ['numeric']); // ['id' => 123]

// Panel title with help tooltip.
$markup = bm_main_panel_title_and_help('Settings', 'Explain the section.');
```

### File Structure
- `bm_main.module` — hooks, helpers, menu behaviors.
- `bm_main.links.menu.yml` — admin menu containers and links.
- `bm_main.routing.yml` — section routes/controllers.
- `templates/` — icon gallery, page templates.
- `help_topics/` — overview and utilities topics.

### Testing
- Cache rebuild smoke: `ddev exec drush cr`
- Coding standards: `ddev exec phpcs web/modules/custom/bm_main --standard=Drupal,DrupalPractice`

### Coding Standards
- PSR-12 and Drupal coding standards; avoid jQuery in new JS.

### Security Considerations
- URL helpers sanitize/normalize input; avoid using raw `$_GET`.
- Messenger modal clears messages after rendering to prevent leakage.

### Versioning
- Part of the LAM Drupal 11 distribution; versioned with the repository.

### Contributing
- Feature branches, coding standards compliance, and update help topics/README when adding utilities.

### License
- Internal use by Mondial-IT / Blue Marloc (no public license declared).

### Maintainers / Contact
- Blue Marloc / Mondial-IT engineering team (project tracker for issues).
