<?php

function _load_wprp() {

	load_wprp_classes();


	//Plugin loaded
	wprp_loaded();

}

function load_wprp_classes() {

	wprp_include( 'classes/wprp_popup_post_type.php' );
	wprp_include( 'classes/wprp_settings.php' );
	wprp_include( 'classes/wprp_email_manager.php' );
	wprp_include( 'classes/wprp_popup_theme.php' );
	wprp_include( 'classes/wprp_default_popup_theme.php' );

	do_action( 'wprp_classes_loaded'  );

	new Wprp_Popup_Post_Type();
	new Wprp_Settings();
	new Wprp_Email_Manager();

	//Register and init the default popup theme
	new Wprp_Default_Popup_Theme();


}

function wprp_loaded() {

	do_action( 'wprp_loaded' );

}

function wprp_include( $file_name, $require = true ) {

	if ( $require )
		require POPUP_PLUGIN_REV_INCLUDE_DIRECTORY . $file_name;
	else
		include POPUP_PLUGIN_REV_INCLUDE_DIRECTORY . $file_name;

}

function wprp_view_path( $view_name, $is_php = true ) {

	if ( strpos( $view_name, '.php' ) === FALSE && $is_php )
		return POPUP_PLUGIN_REV_VIEW_DIRECTORY . $view_name . '.php';

	return POPUP_PLUGIN_REV_VIEW_DIRECTORY . $view_name;

}

function wprp_image_url( $image_name ) {

	return plugins_url( 'images/' . $image_name, POPUP_PLUGIN_REV_MAIN_FILE );

}

function wprp_get_settings() {

	$settings = get_option( 'wprp_settings' );

	$default_settings = Wprp_Settings::default_settings();

	$settings = wp_parse_args( $settings, $default_settings );

	if ( ! isset( $settings['mailchimp']['double_optin'] ) )
		$settings['mailchimp']['double_optin'] = 'true';
	
	return apply_filters( 'wprp_settings', $settings );

}

function wprp_get_email_store() {

	$emails = get_option( 'wprp_email_store' );

	if ( ! $emails )
		$emails = array();

	return apply_filters( 'wprp_email_store', $emails );

}

function wprp_get_popup_themes() {

	$themes = array();

	return apply_filters( 'wprp_popup_themes' , $themes );

}

function wprp_get_popup_meta( $popup_id, $key ) {

	return get_post_meta( $popup_id, $key, true );

}

function wprp_get_popup_theme( $popup_id ) {

	$theme = wprp_get_popup_meta( $popup_id, 'theme' );

	if ( ! $theme )
		$theme = 'default_theme';

	return apply_filters( 'wprp_get_popup_theme', $theme, $popup_id );

}

function wprp_save_popup_meta( $popup_id, $key, $value ) {

	return update_post_meta( $popup_id, $key, $value );

}

function wprp_update_email_store( $emails ) {

	return update_option( 'wprp_email_store', $emails );

}

function wprp_email_manager_store_link() {

	$link = admin_url( 'admin-ajax.php?action=wprp_store_email' );

	return apply_filters( 'wprp_email_manager_store_link', $link );

}

function wprp_email_manager_nonce() {

	return wp_create_nonce( 'wprp_email_manager_nonce' );

}
