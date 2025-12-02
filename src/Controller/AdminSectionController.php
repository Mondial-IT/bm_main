<?php

namespace Drupal\bm_main\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;

class AdminSectionController extends ControllerBase {

  public function overview(): array {
    // Simple landing with links to the four sections.
    $items = [
      Link::fromTextAndUrl($this->t('Administration'), Url::fromRoute('bm_main.section_admin'))->toRenderable(),
      Link::fromTextAndUrl($this->t('Entity'), Url::fromRoute('bm_main.section_entity'))->toRenderable(),
      Link::fromTextAndUrl($this->t('Data production'), Url::fromRoute('bm_main.section_data'))->toRenderable(),
      Link::fromTextAndUrl($this->t('Management'), Url::fromRoute('bm_main.section_manager'))->toRenderable(),
    ];
    return [
      '#theme' => 'item_list',
      '#title' => $this->t('Blue Marloc'),
      '#items' => $items,
    ];
  }

  public function admin(): array {
    return $this->sectionPage('bm_main.bluemarloc_admin', $this->t('Administration'));
  }

  public function entity(): array {
    return $this->sectionPage('bm_main.bluemarloc_entity', $this->t('Entity'));
  }

  public function data(): array {
    return $this->sectionPage('bm_main.bluemarloc_data', $this->t('Data production'));
  }

  public function enhancements(): array {
    return $this->sectionPage('bm_main.bluemarloc_enhancements', $this->t('Enhancements'));
  }

  public function manager(): array {
    return $this->sectionPage('bm_main.bluemarloc_manager', $this->t('Management'));
  }

  public function developer(): array {
    return $this->sectionPage('bm_main.bluemarloc_developer', $this->t('Developer'));
  }

  /**
   * Generic renderer that lists child menu links of a given parent.
   */
  protected function sectionPage(string $parent_link_id, $title): array {
    $build = [
      '#type' => 'container',
      'header' => [
        '#markup' => '<p>' . $this->t('Choose a tool below:') . '</p>',
      ],
    ];

    // Build a list of child links under the given parent link id.
    $menu_tree = \Drupal::service('menu.link_tree');
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters('admin');
    $parameters->setMaxDepth(1);
    $parameters->setRoot($parent_link_id);

    $tree = $menu_tree->load('admin', $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);
    $menu = $menu_tree->build($tree);

    $build['list'] = $menu + ['#prefix' => '<div class="admin-list">', '#suffix' => '</div>'];
    $build['#title'] = $title;

    return $build;
  }

}
