<table class="wprp_input widefat" id="wprp_popup_options">

	<tbody>
		
		<?php do_action( 'wprp_options_meta_box_start', $popup_id ); ?>

		<tr id="status">
			
			<td class="label">
				<label>
					<?php _e( 'Enabled', 'wprp' ); ?>
				</label>
				<p class="description">Auto popup</p>
			</td>
			<td>
				<input <?php checked( $options['enabled'], true ) ?> type="checkbox" value="yes" id="ibtn-enable" name="options[enabled]" />
			</td>
			
		</tr>

		<tr id="theme">
			
			<td class="label">
				<label>
					<?php _e( 'Theme', 'wprp' ); ?>
				</label>
				<p class="description"></p>
			</td>
			<td>
				<select name="options[theme]">
					
					<?php foreach ( $themes as $theme ): ?>
						<option value="<?php echo $theme->id() ?>" <?php selected( $theme->id(), $active_theme ) ?>>
							<?php echo $theme->name() ?>
						</option>
					<?php endforeach; ?>
					
					<?php do_action( 'wprp_html_theme_select' ) ?>
				</select>
			</td>
			
		</tr>

		<tr id="delay_time">
			
			<td class="label">
				<label>
					<?php _e( 'Delay Time', 'wprp' ); ?>
				</label>
				<p class="description"><?php _e( 'Display the popup after the miliseconds you set', 'wprp' ); ?></p>
			</td>
			<td>
				<label>
					<input type="text" value="<?php echo $options['delay_time'] ?>" name="options[delay_time]" placeholder="Enter time in miliseconds" /> ms
				</label>
			</td>
			
		</tr>

		<tr id="mask_color">
			
			<td class="label">
				<label>
					<?php _e( 'Mask Color', 'wprp' ); ?>
				</label>
				<p class="description"></p>
			</td>
			<td>
				<label>
					<input type="text" id="mask_color_field" value="<?php echo $options['mask_color'] ?>" name="options[mask_color]" placeholder="Enter the mask color" />
				</label>
				<div id="mask_colorpicker"></div>
			</td>
			
		</tr>

		<tr id="border_color">
			
			<td class="label">
				<label>
					<?php _e( 'Border Color', 'wprp' ); ?>
				</label>
				<p class="description"></p>
			</td>
			<td>
				<label>
					<input type="text" id="border_color_field" value="<?php echo $options['border_color'] ?>" name="options[border_color]" placeholder="Enter the border color" />
				</label>
				<div id="border_colorpicker"></div>
			</td>
			
		</tr>

		<tr id="transition">
			
			<td class="label">
				<label>
					<?php _e( 'Transition', 'wprp' ); ?>
				</label>
				<p class="description"><?php _e( 'Set the transition effect', 'wprp' ) ?></p>
			</td>
			<td>
				<select name="options[transition]">
					
					<option value="elastic" <?php selected( 'elastic', $options['transition'] ) ?>>
							<?php _e( 'Elastic', 'wprp' ) ?>
					</option>

					<option value="fade" <?php selected( 'fade', $options['transition'] ) ?>>
							<?php _e( 'Fade', 'wprp' ) ?>
					</option>

					<option value="none" <?php selected( 'none', $options['transition'] ) ?>>
							<?php _e( 'None', 'wprp' ) ?>
					</option>
					
					<?php do_action( 'wprp_html_transition_select' ) ?>
				</select>
			</td>
			
		</tr>

		<?php do_action( 'wprp_options_meta_box_before_rules', $popup_id ); ?>

		<tr id="rules">
			
			<td class="label">
				<label>
					<?php _e( 'Rules', 'wprp' ); ?>
				</label>
				<p class="description"><?php _e( 'Apply rules to your popup', 'wprp' ) ?></p>
			</td>
			<td>
				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['show_on_homepage'], true ) ?> name="options[rules][show_on_homepage]" value="true" /> <?php _e( 'Show on homepage', 'wprp' ) ?>
					</label>
				</p>

				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['show_only_on_homepage'], true ) ?> name="options[rules][show_only_on_homepage]" value="true" /> <?php _e( 'Show <strong>only</strong> on homepage', 'wprp' ) ?>
					</label>
				</p>

				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['show_to_logged_in_users'], true ) ?> name="options[rules][show_to_logged_in_users]" value="true" /> <?php _e( 'Show to logged-in users', 'wprp' ) ?>
					</label>
				</p>

				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['hide_on_mobile_devices'], true ) ?> name="options[rules][hide_on_mobile_devices]" value="true" /> <?php _e( 'Hide on mobile devices', 'wprp' ) ?>
					</label>
				</p>

				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['show_only_to_search_engine_visitors'], true ) ?> name="options[rules][show_only_to_search_engine_visitors]" value="true" /> <?php _e( 'Show only to search engine visitors', 'wprp' ) ?>
					</label>
				</p>

				<?php if ( defined('WPRP_PREMIUM_FUNCTIONALITY') &&  WPRP_PREMIUM_FUNCTIONALITY ):
					if ( ! isset( $options['rules']['comment_autofill'] ) )
						$options['rules']['comment_autofill'] = false;
				?>
				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['comment_autofill'], true ) ?> name="options[rules][comment_autofill]" value="true" /> <?php _e( 'Comment author Name/Email autofill', 'wprp' ) ?>
					</label>
				</p>
				<?php endif; ?>

				<?php if ( defined('WPRP_PREMIUM_FUNCTIONALITY') &&  WPRP_PREMIUM_FUNCTIONALITY ):
					if ( ! isset( $options['rules']['exit_popup'] ) )
						$options['rules']['exit_popup'] = false;
				?>
				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['exit_popup'], true ) ?> name="options[rules][exit_popup]" value="true" /> 
							<?php _e( 'Exit Popup', 'wprp' ) ?>
					</label>
				</p>
				<?php endif; ?>

				<?php if ( defined('WPRP_PREMIUM_FUNCTIONALITY') &&  WPRP_PREMIUM_FUNCTIONALITY ):
					if ( ! isset( $options['rules']['exit_intent_popup'] ) )
						$options['rules']['exit_intent_popup'] = false;
				?>
				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['exit_intent_popup'], true ) ?> name="options[rules][exit_intent_popup]" value="true" /> 
							<?php _e( 'Exit Intent Popup', 'wprp' ) ?>
					</label>
				</p>
				<?php endif; ?>

				<?php if ( defined('WPRP_PREMIUM_FUNCTIONALITY') &&  WPRP_PREMIUM_FUNCTIONALITY ): ?>
				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['when_post_end_rule'], true ) ?> name="options[rules][when_post_end_rule]" value="true" /> <?php _e( "Show only when the visitor's <strong>scrollbar</strong> is at the end of the post or page content.", 'wprp' ) ?>
					</label>
				</p>
				<?php endif; ?>

				<p>
					<label>
							<input type="checkbox" <?php checked( $options['rules']['use_cookies'], true ) ?> name="options[rules][use_cookies]" value="true" /> 
							<?php _e( 'Use Cookies', 'wprp' ) ?>
					</label>
				</p>

				<p>
					<label>
						<input type="text" value="<?php echo $options['rules']['cookie_expiration_time'] ?>" name="options[rules][cookie_expiration_time]" placeholder="Cookie Expiration Time" /> <?php _e( 'Days', 'wprp' ) ?>
					</label>
				</p>

			</td>
			
		</tr>


		<?php do_action( 'wprp_options_meta_box_end', $popup_id, $options ); ?>



	</tbody>

</table>