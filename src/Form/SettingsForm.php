<?php


namespace Drupal\bm_main\Form;

use Drupal;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class SettingsForm extends ConfigFormBase {


  public function getFormId(): string {
    return 'bm_main_settings';
  }

  public function buildForm(array $form, FormStateInterface $form_state): array {

    $form['intro'] = [
      '#type' => 'markup',
      '#markup' => '<h1>BM Main</h1><hr><div class="grid-fr-fr-fr gap-20">'];


    $form['outro'] = [
      '#type' => 'markup',
      '#markup' => '</div>'];

    return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {



    parent::submitForm($form, $form_state);
  }

  protected function getEditableConfigNames()
  {
    // TODO: Implement getEditableConfigNames() method.
  }
}
